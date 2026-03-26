import Image from "next/image";
import { useMutation, gql } from '@apollo/client';
type LibEl = {
  Book: Book;
  ReadTime: number;
  Pages: number;
}
type Book = {
  Id: number;
  Title: string;
  Author: string;
  Image: string;
}
const ChangeBookshelf = gql`
  mutation AddBookToShelf($bookId: Int!, $shelf: String!) {
    addBookToShelf(BookId: $bookId, Shelf: $shelf)
  }
`;

const AddBook =({ book, onClose }: {book: LibEl;  onClose: () => void;} ) => {
  const [saveBook] = useMutation(ChangeBookshelf);

  async function AddBookToShelf(id: number, shelf: string) {
    try {
      await saveBook({ variables: { bookId: id, shelf } });
      onClose();
    } catch (err) {
      console.error("Error saving book:", err);
    }
  }

  return (
    <div className='flex items-center justify-around w-full h-auto rounded-full my-5 mx-5 space-x-5'>
      <Image
        src={book.Book.Image}
        alt="Book Image"
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-auto max-w-full max-h-full flex items-center justify-around"/>
      <div className="text-black">
        <label className='flex gap-3 text-5xl '>{book.Book.Title}</label> 
        <label className='flex gap-3 xs:text-3xl text-xl'>{book.Book.Author}</label> 
        <button onClick={() => AddBookToShelf(book.Book.Id, "READING")} className="bg-zinc-800 text-white rounded-md xs:p-3 p-1.5 mt-4 font-interlight" >
          Start reading book
        </button>
      </div>       
    </div>
  )
}

export default AddBook;