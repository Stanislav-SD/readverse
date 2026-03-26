"use client";
import Image from "next/image";
import { useQuery, gql } from '@apollo/client';
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "../../loading";

const GET_BOOKS = gql`
  query GetBooks($take: Int, $top: Boolean!, $genre: String) {
    getBooks(take: $take, top: $top, genre: $genre) {
      Id
      Image
      Author
      Title
    }
  }
`;

type book = {
  Id: number;
  Image: string;
  Author: string;
  Title: string;
}

export default function CataloguePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre");
  const title = "Book Catalogue" + (genre? " – "+genre:"");

  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: { take: 104, top: false, genre }
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <main className="flex justify-center items-center h-screen bg-black text-gray-200">
        <p className="text-red-500 text-2xl">Error loading books: {error.message}</p>
      </main>
    );
  }

  const books = data?.getBooks || [];

  return (
    <div className={`bg-black text-white min-h-screen px-6 py-10`}>
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {books.map((book: book) => (
            <div
              key={book.Id}
              className="relative group flex flex-col items-center text-center cursor-pointer"
              onClick={() => router.push("/bookPreview/" + book.Id)}
            >
              <Image
                src={book.Image}
                alt={`Cover of ${book.Title}`}
                width={300}
                height={450}
                className="w-full h-auto rounded shadow-md object-cover group-hover:scale-105 transition-transform border-2 border-transparent group-hover:border-yellow-400"
              />
              <div className="mt-3">
                <h3 className="font-inter text-base md:text-lg font-semibold leading-tight">
                  {book.Title}
                </h3>
                <p className="font-interlight text-xs md:text-sm text-gray-400 mt-1">
                  {book.Author}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No books found in the catalogue.
        </div>
      )}
    </div>
  );
};