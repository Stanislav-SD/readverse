import BookCard from "./BookCard";

interface Book {
  Id: number;
  Image: string;
  Title: string;
  Author?: string;
}

interface BookGridProps {
  books: Book[];
  showRank?: boolean;
  gridCols?: string; // e.g., "grid-cols-3"
}

export default function BookGrid({ books, showRank = false, gridCols = "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" }: BookGridProps) {
  return (
    <div className={`grid ${gridCols} gap-4 justify-items-center items-center`}>
      {books.map((book, index) => (
        <BookCard
          key={book.Id}
          id={book.Id}
          image={book.Image}
          title={book.Title}
          author={book.Author}
          index={index}
          showRank={showRank}
        />
      ))}
    </div>
  );
}
