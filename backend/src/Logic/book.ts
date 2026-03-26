import prisma from '../prisma/prisma';
// import { addBookToGeneralShelf } from './bookshelf';

async function addBook(Title: string, Image: string, Author: string, Pages: number, Published: Date, Description: string, ISBN10: string, ISBN13: string, genreConnectOrCreate: any, userId: number) 
{
    console.log(Title, Image, Author, Published, Pages, userId)
    Title = Title.trim();
    if(Title === "")
        throw new Error("Title cannot be empty");
    const bookId = (await prisma.book.create({
        data: {
            Title,
            Image,
            Author,
            Pages,
            Published,
            Description,
            ISBN10,
            ISBN13,
            Genre: {
              connectOrCreate: genreConnectOrCreate,
            },
        }
    })).Id;
    console.log("------------------", bookId);
    if(bookId)
    {
        // addBookToGeneralShelf(userId, bookId, "WISHLIST");
        return true;
    }
    return false;
}

async function removeBook(Id: number) 
{
    try {
        await prisma.book.delete({ where: { Id } });
  
        return true;
    } catch (error: any) {
        if (error.code === 'P2025')
            throw new Error("Book not found");

        throw new Error("Something went wrong");
    }
}

async function updateBook(Id: number, Title: string, Image: string, Author: string, Genre: string, Published: string, Pages: number) 
{
    try {
        await prisma.book.update({
            where: {
                Id
            },
            data: {
                Title,
                Image,
                Author,
                Published,
                ISBN10: null,
                ISBN13: null,
                Description: null,
                Pages,
            },
        });
  
        return true;
    } catch (error: any) {
        if (error.code === 'P2025')
            throw new Error("Book not found");

        throw new Error("Something went wrong");
    }
}

export { addBook, removeBook, updateBook };