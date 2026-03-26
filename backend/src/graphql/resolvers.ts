import speakeasy from 'speakeasy';
import prisma from '../prisma/prisma';
import { Prisma } from '@prisma/client';
import tokenUtils, { generateDeviceId } from '../utils/tokenUtils';
import { OAuth2Client } from 'google-auth-library';
import { hashPassword, comparePassword } from '../services/authServices';
import { addBook, removeBook, updateBook } from '../Logic/book';
import { addBookToGeneralShelf, removeBookFromGeneralShelf, updateBookInGeneralShelf } from '../Logic/bookshelf';
import { addNewSession, updateSession, getPagesReadLastMonth } from '../Logic/stats';
import {getWeekRead, reading, pagesRead} from '../Logic/stats';
import { PubSub } from "graphql-subscriptions";
import { addBadge, getBadges, getUserBadges, removeBadge, updateBadge } from '../Logic/badges';
const { Status } = require('@prisma/client');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const pubsub = new PubSub() as PubSub;
type Status = typeof Status[keyof typeof Status];
const STATUS_CHANGED = "STATUS_CHANGED";
const MINIMUM_BOOK_COUNT_FOR_GENRE = 5;

interface BookWithActivity {
    Book: any;
    ReadTime: number;
    Pages: number;
    TimeLeftToFinishBook?: number;
}

interface ShelfGroup {
    Shelf: string;
    Books: BookWithActivity[];
}

const checkAuth = (context) => {
    if (!context.user) throw new Error('UNAUTHORIZED');
};

// GraphQL Resolvers
const resolvers = {
    Query: 
    {
        me: async (_: any, __: any, context: { user: any }) => {
            checkAuth(context);

            const user = await prisma.user.findUnique({ where: { Id: context.user.Id } });
            if (!user) 
                throw new Error('User not found');
            return user;
        },
        getGenres: async (_: any) => {
            const genres = await prisma.genre.findMany();
            // console.log(await prisma.genre.findMany());
            console.log(genres);
            return genres;
        },
        topGenreRecommendations: async (_: any, args: { take: number; },  { userId }: { userId: number }) => {
            if ( !userId ) throw new Error("Unauthorized");
            const take = args.take;
            try {
                const userReadingSessions = await prisma.readingSessionStat.findMany({
                    where: { UserId: userId },
                    include: { BookStat: { include: { Book: { include: { Genre: true } } } } },
                });
        
                if (userReadingSessions.length === 0) return { Genere: "None", Books: [] };
        
                const userGenreCounts = new Map<number, number>();
                userReadingSessions.forEach(session => {
                    session.BookStat?.Book?.Genre.forEach(genre => {
                        userGenreCounts.set(genre.Id, (userGenreCounts.get(genre.Id) || 0) + 1);
                    });
                });
        
                if (userGenreCounts.size === 0) return { Genere: "None", Books: [] };

                const topUserGenreIds = Array.from(userGenreCounts.entries()).sort(([, countA], [, countB]) => countB - countA).map(([genreId]) => genreId);
        
                if (topUserGenreIds.length === 0) return { Genere: "None", Books: [] };
        
                const qualifyingGenres = await prisma.genre.findMany({
                    where: { Id: { in: topUserGenreIds } },
                    include: { _count: { select: { Book: true } } },
                });
        
                const selectedGenre = qualifyingGenres
                    .filter(genre => genre._count.Book >= MINIMUM_BOOK_COUNT_FOR_GENRE)
                    .sort((a, b) => (userGenreCounts.get(a.Id) || 0) - (userGenreCounts.get(b.Id) || 0));
        
                const finalGenreId = selectedGenre?.[0]?.Id || topUserGenreIds[0];
                const genreData = await prisma.genre.findUnique({ where: { Id: finalGenreId } });

                const recommendedBooks = await prisma.book.findMany({
                    where: { Genre: { some: { Id: finalGenreId } } },
                    include: { Genre: true },
                    take: take > 0 ? take: undefined,
                });

                return {
                    Genre: genreData?.Name || "Recommended",
                    Books: recommendedBooks
                }
            } catch (error) {
                console.error("Error fetching top genre recommendations with availability:", error);
                return [];
            }
        },
        getBooks: async (_: any, args: { top: boolean; take: number; genre?: string }) => {
            const { take, top, genre } = args;

            if(top){
                const topBooks = await prisma.rating.groupBy({
                  by: ['BookId'],
                  _avg: { Rating: true },
                  _count: {
                    Rating: true,
                  },
                  orderBy: {
                    _avg: {
                      Rating: 'desc',
                    },
                  },
                  take: take && take > 0 ? take : undefined,
                });

                const bookIds = topBooks.map((book) => book.BookId);        
                if (bookIds.length === 0) {
                    return await prisma.book.findMany({
                        take: take && take > 0 ? take : undefined,
                        where: genre
                            ? {
                                Genre: {
                                    some: {
                                        Name: {
                                            equals: genre,
                                        },
                                    },
                                },
                            }
                            : undefined,
                        include: {
                            Genre: {
                                select: {
                                    Id: false,
                                    Name: true,
                                },
                            },
                        },
                    });
                }

                const books = await prisma.book.findMany({
                    where: {
                        Id: { in: bookIds },
                    },
                    include: {
                        Genre: {
                            select: {
                                Name: true,
                            },
                        },
                    },
                });
                return bookIds.map((id) => books.find((book) => book.Id === id));
            }
            
            return await prisma.$queryRaw`
                SELECT b.* 
                FROM \`Book\` b
                ${genre ? Prisma.sql`
                    INNER JOIN \`_BookToGenre\` btg ON b.\`Id\` = btg.\`A\`
                    INNER JOIN \`Genre\` g ON btg.\`B\` = g.\`Id\`
                    WHERE g.\`Name\` = ${genre}
                ` : Prisma.empty}
                ORDER BY RAND()
                LIMIT ${Number(take) || 10}
            `;
        },
        getBook: async (_: any, args: { id: number; }) => {            
            const { id } = args;
            if(id){
                return await prisma.book.findUnique({
                    where: { Id: id },
                    include: {
                        Genre: {
                            select: {
                                Name: true,
                            },
                        },
                    },
                });
            }
        },
        getStats: async (_: any, __: any, context: { user: any }) => {
            checkAuth(context);
            const uid = context.user.Id;

            return {
                WeekRead: await getWeekRead(uid),
                CurrentReading: await reading(uid),
                PagesRead: await pagesRead(uid),
                PagesReadForMonth: await getPagesReadLastMonth(uid),
            };
        },
        getFriends: async (_: any, __: any, context: { user: any }) => {
            checkAuth(context);

            const friends = await prisma.friends.findMany({
              where: { UserId: context.user.Id, Status: "ACCEPTED" },
              include: { Friend: true }, // Assuming a relation to users table
            });

            return friends.map((friend) => ({
              Id: friend.Friend.Id,
              Username: friend.Friend.Username,
              Status: friend.Friend.Visibility === "INVISIBLE" ? "OFFLINE" : friend.Friend.Status,
              LastActive: friend.Friend.LastActive,
            }));
        },
        getFriendRequests: async (_: any, __: any, context: { user: any }) => {
            checkAuth(context);

            const friendRequests = await prisma.friends.findMany({
                where: { FriendId: context.user.Id, Status: "PENDING" },
                include: {
                    User: {
                        select: {
                            Username: true // Select the Username field from the User model
                        }
                    }
                }
            });
            const waitingResponse = await prisma.friends.findMany({
                where: { UserId: context.user.Id, Status: "PENDING" },
                include: {
                    Friend: {
                        select: {
                            Username: true // Select the Username field from the User model
                        }
                    }
                }
            });

            const Requests = [...friendRequests.map(request => ({
                Id: request.UserId,
                FriendId: request.FriendId,
                Username: request.User.Username,
                Status: request.Status
            })), 
            ...waitingResponse.map(request => ({
                Id: request.UserId,
                FriendId: request.FriendId,
                Username: request.Friend.Username,
                Status: request.Status
            }))];
            return Requests;
        },
        getUsers: async (_: any, __: any, context: { user: any }) => {
            // Get all users who are not already friends or have pending requests
            const friendRequests = await prisma.friends.findMany({
                where: {
                    OR: [
                        { FriendId: context.user.Id, Status: "PENDING" }, // Pending requests where the current user is the receiver
                        { UserId: context.user.Id, Status: "PENDING" },   // Pending requests where the current user Wis the sender
                        { FriendId: context.user.Id, Status: "ACCEPTED" },                              // Accepted friends (remove this if you want only pending requests)
                        { UserId: context.user.Id, Status: "ACCEPTED" }  
                    ],
                },
                select: {
                    UserId: true,     // Get the UserId
                    FriendId: true,   // Get the FriendId
                },
            });

            // Extract the Ids of users that are already friends or have a pending request
            const existingFriendsIds = friendRequests.map(req => req.UserId).concat(friendRequests.map(req => req.FriendId));
            // Find all users except those that are already friends or have a pending request
            const users = await prisma.user.findMany({
                where: {
                    AND:[
                        {Id: {not: context.user.Id}},
                        {Id: {notIn: existingFriendsIds}}
                    ]
                },
                select: {
                    Id: true,
                    Username: true,
                },
            });
        
            return users;
        },
        getLibraryBooks: async (_: any, __: any, context: { user: any }) => {
            checkAuth(context);

            const userId = context.user.Id;
            const result: any[] = await prisma.$queryRaw`
                WITH BookStats AS (
                    SELECT 
                        gs.Shelf,
                        b.Id,
                        b.Title,
                        b.Author,
                        b.Image,
                        b.Pages,
                        COALESCE(bs.ReadTime, 0) as ReadTime,
                        COALESCE(SUM(rss.Pages), 0) as PagesRead,
                        CASE 
                            WHEN COALESCE(SUM(rss.Pages), 0) > 0 
                                AND COALESCE(bs.ReadTime, 0) > 0 
                            THEN (b.Pages - COALESCE(SUM(rss.Pages), 0)) 
                                * (COALESCE(bs.ReadTime, 0) / COALESCE(SUM(rss.Pages), 1))
                            ELSE 0 
                        END as TimeLeft
                    FROM GeneralShelf gs
                    JOIN Book b ON gs.BookId = b.Id
                    LEFT JOIN BookStat bs ON bs.BookId = b.Id 
                        AND bs.UserId = gs.UserId 
                        AND bs.FinishedAt IS NULL
                    LEFT JOIN ReadingSessionStat rss ON rss.BookStatId = bs.Id
                    WHERE gs.UserId = ${userId}
                    GROUP BY gs.Shelf, b.Id, bs.Id
                )
                SELECT 
                    Shelf,
                    JSON_ARRAYAGG(JSON_OBJECT(
                        'Book', JSON_OBJECT(
                            'Id', Id,
                            'Title', Title,
                            'Author', Author,
                            'Image', Image,
                            'Pages', Pages
                        ),
                        'ReadTime', ReadTime,
                        'Pages', PagesRead,
                        'TimeLeftToFinishBook', TimeLeft
                    )) as Books
                FROM BookStats
                GROUP BY Shelf
                ORDER BY Shelf ASC;
            `;

            return result;
        },
        getBadges: () => getBadges(),
        getUserBadges: (_: any, __: any, context: any) => {
            checkAuth(context);
            return getUserBadges(context.user.Id);
        }
    },
    Mutation:
    {
        //Auth and User Logic
        register: async (_: any, args: { username: string; email: string; password: string }, context: { ip: string; userAgent: string, res:any }) => {
            if (!args.email || !args.username || !args.password)
                throw new Error('All fields are required.');

            const existingUser = await prisma.user.findUnique({ where: { Email: args.email } });

            if (existingUser) 
                throw new Error('Email already in use.');
            
            if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}/.test(args.password))
                throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            
            const hashedPassword = await hashPassword(args.password);
    
            const user = await prisma.user.create({
                data: { Username: args.username, Email: args.email, Password: hashedPassword }
            });

            
            const accessToken = tokenUtils.generateToken({ Id: user.Id, Role: user.Role });
            const deviceId = generateDeviceId(context.ip, context.userAgent);
            const {refreshToken, encryptedRefreshToken} = tokenUtils.generateRefreshToken();
            await prisma.refreshTokens.create({
              data: {
                Token: encryptedRefreshToken,
                UserId: user.Id,
                DeviceId: deviceId,
                ExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
              },
            });
            
            return accessToken;
        },
        login: async (_: any, args: { email: string; password: string, refresh: boolean }, context: { ip: string; userAgent: string, res:any }) => {
            if (!args.email || !args.password)
                throw new Error('Email and password are required');
    
            const user = await prisma.user.findUnique({ where: { Email: args.email } });
            if (!user) 
                throw new Error('User not found');
    
            const valid = await comparePassword(args.password, user.Password);
            if (!valid) 
                throw new Error('Invalid password');
    
            const accessToken = tokenUtils.generateToken({ Id: user.Id, Role: user.Role });
            if(args.refresh){
                const deviceId = generateDeviceId(context.ip, context.userAgent);
                const existingToken = await prisma.refreshTokens.findUnique({
                  where: { UserId_DeviceId: { UserId: user.Id, DeviceId: deviceId } },
                });

                if (existingToken) {
                  await prisma.refreshTokens.delete({ where: { Id: existingToken.Id } });
                }

                const {refreshToken, encryptedRefreshToken} = tokenUtils.generateRefreshToken();
                await prisma.refreshTokens.create({
                  data: {
                    Token: encryptedRefreshToken,
                    UserId: user.Id,
                    DeviceId: deviceId,
                    ExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
                  },
                });

                context.res.cookie('refreshToken', refreshToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production', // Enable only in production (HTTPS)
                  sameSite: 'Strict',
                  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                });
            }

            return JSON.stringify(accessToken)
        },
        logout: async (_: any, __: any, context: { ip: string; userAgent: string, res: any, req: any }) => {
            const refreshToken = context.req.cookies?.refreshToken;
            const deviceId = generateDeviceId(context.ip, context.userAgent);
            try{
                tokenUtils.invalidateRefreshToken(refreshToken, deviceId);
            } catch (err) {
                console.log(err);
                // if(err === "Ivalid refresh token")
                //     throw new ApolloError("Unauthorized", "401", { message: err });
            }
            context.res.clearCookie('refreshToken');
            
            return true;
        },
        // googleLogin: async (_: any, args: { token: string }) => {
        //     try {
        //         const ticket = await googleClient.verifyIdToken({
        //             idToken: args.token,
        //             audience: process.env.GOOGLE_CLIENT_ID,
        //         });
        //         const payload = ticket.getPayload();
        //         if (!payload) 
        //             throw new Error('Invalid Google token');
            
        //         const { email, name } = payload;
        //         let user = await prisma.user.findUnique({ where: { Email: email } });
            
        //         if (!user) {
        //             user = await prisma.user.create({
        //                 data: {
        //                     Username: name || 'Google User',
        //                     Email: email!,
        //                     Password: '', // Password not needed for Google users
        //                 },
        //             });
        //         }
            
        //         const accessToken = tokenUtils.generateToken({ id: user.Id, role: user.Role });
        //         const refreshToken = tokenUtils.generateRefreshToken(user.Id);
        //         return JSON.stringify({ accessToken, refreshToken });
        //     } catch (err) {
        //         throw new Error('Google login failed');
        //     }
        // },
        refreshToken: async (_: any, __: any, context: { ip: string; userAgent: string, res:any, req: any }) => {
          
            if (!context?.req) {
              throw new Error('❌ Request is missing in context');
            }
          
            const refreshToken = context.req.cookies?.refreshToken;
            // console.log(refreshToken);
          
            if (!refreshToken) {
              throw new Error('❌ No refresh token provided.');
            }

            const { ip, userAgent } = context;
            const deviceId = generateDeviceId(ip, userAgent);
            try{
                const userId = await tokenUtils.verifyRefreshToken(refreshToken, deviceId);
                const user = await prisma.user.findUnique({ where: { Id: userId } });
    
                const accessToken = tokenUtils.generateToken({ Id: userId, Role: user?.Role });

                return accessToken;
            } catch (err) {
                console.log(err);
                // if(err === "Expired refresh token" || err === "Ivalid refresh token")
                //     throw new ApolloError("Unauthorized", "401", { message: err });
            }
        },
        enable2FA: async (_: any, __: any, context: { user: any }) => {
            checkAuth(context);

            const user = await prisma.user.findUnique({ where: { Id: context.user.Id } });
    
            if (!user) throw new Error('Unauthorized');

            let secretkey = user.TwoFASecret;
    
            if(!secretkey) {
                secretkey = speakeasy.generateSecret().base32;
                await prisma.user.update({
                    where: { Id: context.user.Id },
                    data: { TwoFASecret: secretkey },
                });
            }

            const otpauthUrl = speakeasy.otpauthURL({
                secret: secretkey,
                encoding: 'base32',
                label: user.Email,
                issuer: 'Readverse',
            });
            return otpauthUrl;
        },
        disable2FA: async (_: any, args: { token: string }, context: { user: any }) => {
            checkAuth(context);

            const user = await prisma.user.findUnique({ where: { Id: context.user.Id } });
            if (!user) throw new Error('Unauthorized');

            if(!user.TwoFASecret) throw new Error('2FA not enabled');
            
            const verified = speakeasy.totp.verify({
                secret: user.TwoFASecret,
                encoding: 'base32',
                token: args.token,
            });

            if (!verified) throw new Error('Invalid 2FA token');
            
            await prisma.user.update({
                where: { Id: context.user.Id },
                data: { TwoFASecret: "" },
            });
        },
        verify2FA: async (_: any, args: { token: string }, context: { user: any }) => {
            checkAuth(context);
    
            const user = await prisma.user.findUnique({ where: { Id: context.user.Id } });
            if (!user || !user.TwoFASecret) throw new Error('2FA not enabled');

            const verified = speakeasy.totp.verify({
                secret: user.TwoFASecret,
                encoding: 'base32',
                token: args.token,
            });

            if (!verified) throw new Error('Invalid 2FA token');
    
            return '2FA verified successfully';
        },

        //Book Logic
        addBook: async (_: any, args: { Title: string; Image: string; Author: string; Pages: number; Genre: string[]; Published: string; Description: string; ISBN10: string; ISBN13: string; }, context: { user: any }) => {
            checkAuth(context);

            const {
                Title,
                Image,
                Author,
                Published,
                Pages,
                Description,
                ISBN10,
                ISBN13,
                Genre,
            } = args;

            if (!args.Title) throw new Error("Title cannot be empty");
                
            // console.log(args);

            try{
                // console.log(Genre);
                let publishedDate: Date | null = null;
                publishedDate = new Date(Published);
                const uniqueGenreNames = Genre ? [...new Set(Genre.map(g => g.trim()).filter(g => g))] : [];
                const genreConnectOrCreate = uniqueGenreNames.map((genreName) => ({
                    where: { Name: genreName }, // How to find the genre (unique name)
                    create: { Name: genreName }, // Data to use if creating a new genre
                }));
                const something = await addBook(Title, Image, Author, Pages, publishedDate, Description, ISBN10, ISBN13, genreConnectOrCreate, context.user.Id);
                // console.log("----------------", something)
                return something;
            }catch(err){
                // if(err === "Title cannot be empty")
                //     throw new ApolloError(err, "400", { message: err });
                console.log(err);
                return false;
            }
        },
        updateBook: async (_: any, args: { BookId: number; Title: string; Image: string; Author: string; Genre: string; Published: string; Pages: number }, context: { user: any }) => {
            if (!args.Title) throw new Error('Title is required');
            return await updateBook(args.BookId, args.Title, args.Image, args.Author, args.Genre, args.Published, args.Pages);
        },
        deleteBook: async (_: any, args: { BookId: number }) => {
            try{
                return await removeBook(args.BookId);
            }catch(err){
                // if(err === "Book not found")
                //     throw new ApolloError(err, "NOT_FOUND", { message: err });
                // else(err === "Something went wrong")
                //     throw new ApolloError("Something went wrong", "INTERNAL_SERVER_ERROR", { message: "An unexpected error occurred." });
            }
        },

        //Badge Logic
        addBadge: async (_: any, args: any, context: any) => {
            checkAuth(context);
            
            const { Image, Label, Quest, Conditions } = args;
            return await addBadge(Image, Label, Quest, Conditions);
        },

        updateBadge: async (_: any, args: any, context: any) => {
            checkAuth(context);
            
            const { Id, ...data } = args;
            return await updateBadge(Id, data);
        },

        removeBadge: async (_: any, { Id }: { Id: number }, context: any) => {
            checkAuth(context);
            
            return await removeBadge(Id);
        },

        //Shelf Logic
        addBookToShelf: async (_: any, args: { BookId: number; Shelf: string }, context: any) => {
            checkAuth(context);
            if (!args.Shelf) throw new Error('Shelf is required');
            if (!args.BookId) throw new Error('Book is required');
            
            return await addBookToGeneralShelf(context.user.Id, args.BookId, args.Shelf);
        },
        updateBookInShelf: async (_: any, args: { Id: number, Shelf: string }, context: { user: any }) => {
            checkAuth(context);
            if (!args.Id) throw new Error('Id is required');
            if (!args.Shelf) throw new Error('Shelf is required');

            return await updateBookInGeneralShelf(prisma, context.user.Id, args.Id, args.Shelf);
        },
        removeBookFromShelf: async (_: any, args: { Id: number }, context: { user: any }) => {
            checkAuth(context);
            if (!args.Id) throw new Error('Id is required');

            return await removeBookFromGeneralShelf(context.user.Id, args.Id);
        },

        //Reading Session Logic
        saveNewReadingSession: async (_: any, args: { BookId: number, Time: number, Pages: number }, context: { user: any }) => {
            checkAuth(context);
            if (!args.BookId) throw new Error('Book is required');
            if (!args.Time) throw new Error('Time is required');
            if (!args.Pages) throw new Error('Pages is required');
            
            return await addNewSession(args.BookId, context.user.Id, args.Time, args.Pages);
        },
        updateBookSession: async (_: any, args: { Id: number, Time: number, Pages: number }, context: { user: any }) => {
            checkAuth(context);
            if (!args.Id) throw new Error('Id is required');
            if (!args.Time) throw new Error('Time is required');
            if (!args.Pages) throw new Error('Pages is required');

            return await updateSession(args.Id, args.Time, args.Pages);
        },

        //Friend System Logic
        sendFriendRequest: async (_: any, args: { friendId: number }, context: { user: any }) => {
            checkAuth(context);
            
            const existingRequest = await prisma.friends.findFirst({
                where: { UserId: context.user.Id, FriendId: args.friendId, Status: "PENDING" },
            });
    
            if (existingRequest) throw new Error("Request already sent.");
    
            await prisma.friends.create({
                data: { UserId: context.user.Id, FriendId: args.friendId, Status: "PENDING" },
            });
    
            return true;
        },
        unsendFriendRequest: async (_: any, args: { friendId: number }, context: { user: any }) => {
            checkAuth(context);

            const existingRequest = await prisma.friends.findFirst({
                where: { UserId: context.user.Id, FriendId: args.friendId, Status: "PENDING" },
            });
    
            if (!existingRequest) throw new Error("Not found request.");
    
            await prisma.friends.delete({
                where: { Id: existingRequest.Id } 
            });
    
            return true;
        },
        acceptFriendRequest: async (_: any, args: { friendId: number }, context: { user: any }) => {
            checkAuth(context);

            await prisma.friends.updateMany({
                where: { UserId: args.friendId, FriendId: context.user.Id, Status: "PENDING" },
                data: { Status: "ACCEPTED" },
            });
    
            await prisma.friends.create({
                data: { UserId: context.user.Id, FriendId: args.friendId, Status: "ACCEPTED" },
            });
    
            return true;
        },
        rejectFriendRequest: async (_: any, args: { friendId: number }, context: { user: any }) => {
            checkAuth(context);

            await prisma.friends.deleteMany({
                where: { UserId: args.friendId, FriendId: context.user.Id, Status: "PENDING" },
            });
            return true;
        },
        removeFriend: async (_: any, args: { friendId: number }, context: { user: any }) => {
            checkAuth(context);

            await prisma.friends.deleteMany({
                where: { OR: [{ UserId: context.user.Id, FriendId: args.friendId }, { UserId: args.friendId, FriendId: context.user.Id }] },
            });
            return true;
        },

        //user status
        updateStatus: async (_: any, { status }: { status: Status }, context: { user: any }) => {
            checkAuth(context);

            const user = await prisma.user.update({
                where: { Id: context.user.Id },
                data: { Status: status },
            });
    
            pubsub.publish(STATUS_CHANGED, { statusChanged: user });
    
            return true;
        },
    },

    Subscription: {
      statusChanged: {
        subscribe: () => pubsub.asyncIterableIterator([STATUS_CHANGED]),
      },
    },
};

export default resolvers;