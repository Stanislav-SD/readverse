import prisma from '../prisma/prisma';
import { updateBookInGeneralShelf } from './bookshelf';
import { startOfMonth, format } from 'date-fns';
import { checkAndAwardBadges } from './badges';

//        ##        #######   ######   ####  ######  
//        ##       ##     ## ##    ##   ##  ##    ## 
//        ##       ##     ## ##         ##  ##       
//        ##       ##     ## ##   ####  ##  ##       
//        ##       ##     ## ##    ##   ##  ##       
//        ##       ##     ## ##    ##   ##  ##    ## 
//        ########  #######   ######   ####  ######  

// Final book stats logic
async function addNewSession(bookId: number, userId: number, time: number, pages: number)
{
    if(!(bookId > 0)) throw new Error("Book not found");
    if(!(userId > 0)) throw new Error("User not found");
    let bookStatId = (await prisma.bookStat.findFirst({ where: { BookId: bookId, UserId: userId, FinishedAt: null}, orderBy: { FinishedAt: 'asc' } }))?.Id;
    
    return await prisma.$transaction(async (prisma) => {
        if(bookStatId)
        {
            const readPages = await prisma.readingSessionStat.aggregate({ where: { BookStatId: bookStatId }, _sum: { Pages: true }})
            const totalPages = readPages._sum.Pages || 0;
            const bookPages = (await prisma.book.findFirst({ where: { Id: bookId } }))?.Pages;
            if(bookPages && totalPages+pages >= bookPages)
            {
                await prisma.bookStat.update({
                    where: { Id: bookStatId },
                    data: {
                        FinishedAt: new Date()
                    }
                });
                updateBookInGeneralShelf(prisma, userId, bookId, "READ");
            }
            const oldSession = await prisma.readingSessionStat.findUnique({
                where: { Id: bookStatId }
            });

            const diff = time - oldSession.ReadTime;

            await prisma.bookStat.update({
                where: { Id: bookStatId },
                data: {
                    ReadTime: {
                        increment: diff
                    },
                }
            });
        }else
        {
            bookStatId = (await prisma.bookStat.create({
                data: {
                    UserId: userId,
                    BookId: bookId,
                    ReadTime: time,
                },
            })).Id;
            updateBookInGeneralShelf(prisma, userId, bookId, "READING");
        }

        await prisma.readingSessionStat.create({
            data: {
                ReadTime: time,
                Pages: pages,
                BookStatId: bookStatId,
                UserId: userId
            }
        });
        
        await checkAndAwardBadges(userId);

        return true;
    });
}

async function addNewStartSession(bookId: number, userId: number)
{
    if(!(bookId > 0)) throw new Error("Book not found");
    if(!(userId > 0)) throw new Error("User not found");
    let bookStatId = (await prisma.bookStat.findFirst({ where: { BookId: bookId, UserId: userId, FinishedAt: null}, orderBy: { FinishedAt: 'asc' } }))?.Id;
    
    return await prisma.$transaction(async (prisma) => {
        if(!bookStatId)
        {
            bookStatId = (await prisma.bookStat.create({
                data: {
                    UserId: userId,
                    BookId: bookId,
                    ReadTime: 0,
                },
            })).Id;
        }
        
        return true;
    });
}

async function removeSession(idSession: number)
{
    if(!(idSession > 0)) throw new Error("Session not found");

    try {
        return await prisma.$transaction(async (prisma) => {
            await prisma.readingSessionStat.deleteMany({ where: { BookStatId: idSession } });
            await prisma.bookStat.delete({ where: { Id: idSession } });
            
            return true;
        });
    } catch (error: any) {
        if (error.code === 'P2025')
            throw new Error("Not found");
        throw new Error("Something went wrong");
    }
}

async function updateSession(id: number, time: number, pages: number)
{
    if(!(id > 0))
        throw new Error("Book not found");
    try {
        return await prisma.$transaction(async (prisma) => {
            if(!(id > 0)) throw new Error("Book not found");
            try {
                const session = await prisma.readingSessionStat.update({ 
                    where: { 
                        Id: id,
                    },
                    data: {
                        Pages: pages,
                        ReadTime: time
                    }
                });
                await prisma.bookStat.update({ 
                    where: { Id: session.BookStatId },
                    data: {
                        ReadTime: {
                            increment: time
                        },
                    }
                });
          
                return true;
            } catch (error: any) {
                if (error.code === 'P2025')
                    throw new Error("Book not found or already finished");
                throw new Error("Something went wrong");
            }
        });
    } catch (error: any) {
        if (error.code === 'P2025')
            throw new Error("Book not found");
        throw new Error("Something went wrong");
    } 
}

//Book session stats

async function removeReadingSession(id: number)
{
    if(!(id > 0)) throw new Error("Book not found");
    try {
        await prisma.readingSessionStat.delete({ where: { Id: id } });
    
        return true;
    } catch (error: any) {
        if (error.code === 'P2025')
            throw new Error("Book not found");
        throw new Error("Something went wrong");
    }
}

//Dashboard Stats
interface PagesResult {
    pages: number | null;
}
async function getWeekRead(id: number)
{
    const currentDate = new Date();
    let dayOfWeek = currentDate.getDay();
    if (dayOfWeek == 0) dayOfWeek = 7;

    let pagesForDays = [];
    for(let i = dayOfWeek-1; i >= 0; i--)
    {
        let pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i);
        
        const formattedDate = pastDate.toISOString().split('T')[0];
        const result = await prisma.$queryRaw<PagesResult[]>`
            SELECT SUM(ReadingSessionStat.Pages) as pages
            FROM \`ReadingSessionStat\`
            inner join \`BookStat\` on BookStat.Id = ReadingSessionStat.BookStatId
            WHERE DATE(ReadingSessionStat.createdAt) = ${formattedDate} and BookStat.UserId = ${id};
        `;

        const pages = result.length > 0 && result[0].pages !== null ? result[0].pages : 0;
        pagesForDays.push(pages);
    }
    return pagesForDays;
}

async function reading(id: number)
{
    const CurrentReading = await prisma.bookStat.count({
        where: {
            FinishedAt: null,
            UserId: id,
        },
    });
    return CurrentReading;
}

async function pagesRead(id: number)
{
    const result = await prisma.$queryRaw<PagesResult[]>`
        SELECT SUM(Pages) as pages
        FROM \`BookStat\`
        inner join \`ReadingSessionStat\` ON ReadingSessionStat.BookStatId = BookStat.Id
        WHERE BookStat.UserId = ${id};
    `;
    const pages = result.length > 0 && result[0].pages !== null ? result[0].pages : 0;
    return pages;
}

async function getPagesReadLastMonth(id: number) {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);

    const pagesRead = await prisma.readingSessionStat.groupBy({
        by: ['CreatedAt'],
        where: {
            CreatedAt: {
                gte: firstDayOfMonth,
                lte: now,
            },
            UserId: id,
        },
        _sum: {
            Pages: true,
        },
        orderBy: {
            CreatedAt: 'asc',
        },
    });

    const pagesByDate = await pagesRead.reduce<Record<string, number>>((acc, stat) => {
        const date = stat.CreatedAt.toISOString().split('T')[0]; // Extract YYYY-MM-DD
        acc[date] = stat._sum?.Pages || 0; // Ensure it doesn't return null
        return acc;
    }, {} as Record<string, number>);
    return pagesByDate;
}

export { addNewSession, removeSession, updateSession, removeReadingSession, getWeekRead, reading, pagesRead, getPagesReadLastMonth, addNewStartSession };