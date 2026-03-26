import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import { PrismaClient, Prisma } from '@prisma/client';
import typeDefs from './graphql/typeDefs';
import { verifyToken } from './utils/tokenUtils';
import resolvers from './graphql/resolvers';
import cookieParser from 'cookie-parser';
import prisma from './prisma/prisma';
import { GraphQLFormattedError } from 'graphql';
import { ApolloServerErrorCode, unwrapResolverError } from '@apollo/server/errors';
import { execSync } from 'child_process';

dotenv.config();

const app = express();

app.set('trust proxy', 'loopback');

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ["https://readverse.eu", "https://www.readverse.eu"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));

app.use(cookieParser());
app.use(express.json());

// Middleware
app.use(morgan('combined'));
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
    },
  },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minute //15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 5000 : 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const publicOperations = new Set(["Register", "Login", "IntrospectionQuery", "RefreshToken"]);

const preAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const operationName = req.body?.operationName;

  console.log(operationName)

  if (req.method === 'OPTIONS') {
    return next();
  }

  if (operationName && publicOperations.has(operationName)) {
    // console.log(`Public operation allowed: ${operationName}`);
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(" ")[1] : undefined;
  
  if (!token) {
    console.warn(`🚫 Unauthorized: Token missing for operation: ${operationName || 'Unknown'}`);
    res.status(401).json({ errors: [{ message: "Unauthorized: Access token is required." }] });
    return;
  }

  try {
    const user = verifyToken(token);
    (req as any).user = user;
    next();
  } catch (err: any) {
    console.warn(`🚫 Unauthorized: Invalid token for operation: ${operationName || 'Unknown'}. Error: ${err.message}`);
    res.status(401).json({ errors: [{ message: `Unauthorized: ${err.message || 'Invalid or expired token.'}` }] });
  }
};
app.use('/graphql', preAuthMiddleware);

// Apollo Server
const server = new ApolloServer<{ prisma: PrismaClient; user?: any }>({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV == 'production',
  formatError: (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
    const originalError = unwrapResolverError(error);

    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 GraphQL Error (Prod - Internal Log):', {
        message: formattedError.message,
        code: formattedError.extensions?.code,
        path: formattedError.path,
        originalErrMessage: originalError instanceof Error ? originalError.message : String(originalError),
      });


      if (
        formattedError.extensions?.code &&
        typeof formattedError.extensions.code === 'string' &&
        formattedError.extensions.code !== ApolloServerErrorCode.INTERNAL_SERVER_ERROR &&
        formattedError.extensions.code !== ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      ) {
        return formattedError;
      } else {
        return {
          message: 'Internal Server Error',
          extensions: {
            code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          }
        };
      }
    }
    
    console.error('🚨 GraphQL Error (Dev):', formattedError);
    if (originalError instanceof Error) {
      console.error('Original Error Stack (Dev):', originalError.stack);
    } else if (originalError) {
      console.error('Original Error (Dev):', originalError);
    }
    
    return formattedError;
  },
});

function getPrismaTableNames(): string[] {
  if (!Prisma.dmmf || !Prisma.dmmf.datamodel || !Prisma.dmmf.datamodel.models) {
      console.error("❌ Could not access Prisma DMMF. Ensure Prisma Client is generated (`npx prisma generate`).");
      throw new Error("Prisma DMMF not available.");
  }
  const modelTableNames = Prisma.dmmf.datamodel.models.map(model =>
      model.dbName || model.name
  );
  const allTableNames = [...modelTableNames, '_prisma_migrations'];
  return [...new Set(allTableNames)];
}

async function initializeDatabase() {
  console.log('🔄 Initializing Database...');
  const initPrisma = new PrismaClient();
  const missingTables: string[] = [];
  let allTablesExist = true;
  let seedDataExists = false;

  try {
    console.log('   [1/4] Checking database connection...');
    try {
      await initPrisma.$connect();
      console.log('   ✅ Database connection successful.');
    } catch (error: any) {
      console.error('   ❌ FATAL: Failed to connect to the database.');
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error(`      Reason: ${error.message} (Code: ${error.errorCode})`);
        if (error.errorCode === 'P1003') console.error('      > The database specified might not exist.');
      } else { console.error('      Error:', error); }
      console.error('      > Verify DATABASE_URL and ensure DB server is running.');
      throw new Error("Database connection failed");
    }

    console.log('   [2/4] Verifying existence of all schema-defined tables...');
    const expectedTables = getPrismaTableNames();
    console.log(`      Expected tables: ${expectedTables.length} (checking list...)`);

    for (const tableName of expectedTables) {
        try {
          await initPrisma.$queryRawUnsafe(`SELECT 1 FROM \`${tableName}\` LIMIT 1`);
        } catch (error: any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2021' || error.code === 'P2010') ||
            error.message?.includes('ER_NO_SUCH_TABLE') ||
            error.message?.includes('undefined_table') ||
            error.message?.includes('no such table'))
          {
            missingTables.push(tableName);
            allTablesExist = false;
          } else {
            console.error(`   ❌ Error checking for table '${tableName}':`, error.message);
            missingTables.push(`${tableName} (Error: ${error.code || 'Check Failed'})`);
            allTablesExist = false;
          }
        }
    }

    if (!allTablesExist) {
      console.error('\n   ❌ ERROR: Database schema is incomplete or requires initialization.');
      console.error('      The following required tables were not found or caused errors:');
      missingTables.forEach(table => console.error(`        - ${table}`));
      console.error('\n      >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.error('      >>> Before running the API, apply database migrations:   <<<');
      console.error('      >>>                                                    <<<');
      console.error('      >>>             `npx prisma migrate deploy`            <<<');
      console.error('      >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n');
      throw new Error("Database schema validation failed. Manual migration needed.");
    } else {
      console.log('   ✅ All expected tables found.');
    }

    console.log('   [3/4] Checking if seeding is required (looking for admin user)...');
    try {
      const adminUser = await initPrisma.user.findUnique({
        where: { Email: 'stanislav.dechev.sd@gmail.com' },
      });
      if (adminUser) {
        seedDataExists = true;
        console.log('   ✅ Key seed data (admin user) found.');
      } else {
        console.log('   ℹ️ Key seed data (admin user) not found.');
        seedDataExists = false;
      }
    } catch (error: any) {
      console.error('   ❌ Error checking for seed data:', error.message);
      seedDataExists = false;
      console.warn('   ⚠️ Proceeding assuming seeding is required due to check error.');
    }

    if (!seedDataExists) {
      console.log('   [4/4] Running automatic database seeding...');
      try {
        console.log("      Executing: npx prisma db seed");
        execSync('npx prisma db seed', { stdio: 'inherit' }); // Shows seed script output
        console.log('   ✅ Database seeding completed successfully.');
      } catch (seedError) {
        console.error('   ❌ FATAL: Failed to seed database automatically.');
        console.error('      Check the output from the seed script above for details.');
        throw new Error("Database seeding failed");
      }
    } else {
      console.log('   [4/4] Skipping automatic seeding (data already exists).');
    }

    console.log('✅ Database initialization checks complete.');

  } catch (initError: any) {
    console.error(`\n❌ Database Initialization Failed: ${initError.message}`);
    console.error('   API server startup aborted.');
    await initPrisma.$disconnect().catch(disconnectErr => console.error('Error disconnecting init client:', disconnectErr));
    process.exit(1); // Exit the process cleanly
  } finally {
    // Ensure the temporary client is always disconnected
    if (initPrisma) {
      await initPrisma.$disconnect();
    }
  }
}


async function startServer() {
  await initializeDatabase();
  console.log('🚀 Starting Apollo Server...');
  await server.start();
  
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'unknown';
        const user = (req as any).user;
        return { 
          req,
          res,
          prisma, 
          user,
          ip,
          userAgent
        };
      },
    }) as unknown as express.RequestHandler
  );

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start', err);
});