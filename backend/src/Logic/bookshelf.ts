const { BaseShelf } = require('@prisma/client');
import prisma from '../prisma/prisma';
import { addNewStartSession } from './stats';
type BaseShelfType = typeof BaseShelf[keyof typeof BaseShelf];

async function addBookToGeneralShelf(userId: number, bookId: number, shelf: BaseShelfType)
{
    console.log("Adding book to general shelf", bookId, shelf); 
    if(bookId < 1)
        throw new Error("Book not found");
    if(!Object.values(BaseShelf).includes(shelf))
        throw new Error("Shelf not found");

    if(shelf == "READING") await addNewStartSession(bookId, userId);

    
    if(await prisma.generalShelf.findFirst({where:{ UserId: userId, BookId: bookId }}))
    {
        await prisma.generalShelf.update({
            where: { 
                BookId_UserId: {
                    BookId: bookId,
                    UserId: userId
                }
            },
            data: {
                Shelf: shelf as BaseShelfType,
            }
        });
    } else {
        await prisma.generalShelf.create({
            data: {
                Shelf: shelf as BaseShelfType,
                UserId: userId,
                BookId: bookId
            }
        });
    }
    return true;
}

async function removeBookFromGeneralShelf(userId: number, id: number) {
    try {
      await prisma.generalShelf.delete({ where: { Id: id, UserId: userId } });
  
      return true;
    } catch (error: any) {
      if (error.code === 'P2025')
        throw new Error("Book not found");
      throw new Error("Something went wrong");
    }
}

async function updateBookInGeneralShelf(prisma: any, userId: number, bookId: number, shelf: BaseShelfType) {
    try {
        await prisma.generalShelf.update({
            where: { 
                BookId_UserId: {
                    BookId: bookId,
                    UserId: userId
                }
            },
            data: {
                Shelf: shelf as BaseShelfType,
            }
        });
  
      return true;
    } catch (error: any) {
        if (error.code === 'P2025')
          throw new Error("Book not found");
        throw new Error("Something went wrong");  
    }
}

export { addBookToGeneralShelf, removeBookFromGeneralShelf, updateBookInGeneralShelf };