"use client";
import Image from "next/image";
import { useQuery, gql } from '@apollo/client';
import { useRouter } from "next/navigation";
import Loading from "../../loading";
import SectionHeader from "@/app/components/bookGallery/SectionHeader";
import BookGrid from "@/app/components/bookGallery/BookGrid";

const GET_BOOKS = gql`
  query GetBooks($take: Int, $top: Boolean!) {
    getBooks(take: $take, top: $top) {
      Id
      Image
      Author
      Title
    }
  }
`;
const GET_GENRE_BOOKS = gql`
  query TopGenreRecommendations($take: Int) {
    topGenreRecommendations(take: $take) {
      Genre
      Books {
        Id
        Title
        Image
        Author
      }
    }
  }
`;

export default function BookGallery() {
  const router = useRouter();

  const { data: topBooksData, loading: topBooksLoading, error: topBooksError } = useQuery(GET_BOOKS, {
    variables: { take: 5, top: true }
  });
  const { data: booksData, loading: booksLoading, error: booksError } = useQuery(GET_BOOKS, {
    variables: { take: 8, top: false }
  });
  const { data: genreBooksData, loading: genreBooksLoading, error: genreBooksError } = useQuery(GET_GENRE_BOOKS, {
    variables: { take: 8 }
  });
  //console.log(genreBooksData)
      
  if (booksLoading || topBooksLoading ||genreBooksLoading) {
    return (
      <Loading />
    );
  }
  
  if (topBooksError || booksError || genreBooksError) {
    return (
      <main className="flex justify-center items-center h-screen bg-black text-gray-200">
        <p className="text-red-500 text-2xl">Error: {topBooksError?.message || booksError?.message}</p>
      </main>
    );
  }

  //console.log(topBooksData)
  //console.log(booksData)
  //console.log(genreBooksData)
  
  const genre = genreBooksData.topGenreRecommendations.Genre;
  const title = "From an genre you might love" + (genre ? " – "+genre:"");

  return (
    <div className={`bg-black text-white min-h-screen px-6 py-10`}>
      <SectionHeader title="Save your favorite books" line={true} buttonText="See All" onClick={() => location.href = "/catalogue"}/>

      {/* Top Rated Section */}
      <div className="mb-10">
        <SectionHeader title="Top rated" line={false}/>
        <BookGrid books={topBooksData.getBooks} showRank={true} gridCols="grid-cols-3 sm:grid-cols-5" />
      </div>
      {/* From an genre you might love */}
      <div className="mb-10">
        <SectionHeader title={title} line={false} buttonText="See All" onClick={() => location.href = `/catalogue?genre=${genre}`}/>
        {genreBooksData.length > 0 ? (
          <BookGrid books={genreBooksData.topGenreRecommendations.Books} gridCols="grid-cols-2 xs:grid-cols-4 md:grid-cols-8" />
        ) : (
            <div className="text-center text-gray-500 text-xl mt-4">
              No enough data.
            </div>
        )}
      </div>

      {/* Books */}
      <div className="mb-10">
        <SectionHeader title="Books" line={false} buttonText="See All" onClick={() => location.href = "/catalogue"}/>
        <BookGrid books={booksData.getBooks} gridCols="grid-cols-2 xs:grid-cols-4 md:grid-cols-8" />
      </div>
    </div>
  );
};
