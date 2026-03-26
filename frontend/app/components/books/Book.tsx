"use client"
import Image from "next/image";
import { useState, useEffect } from "react";

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
  Pages: number;
}
export default function BookTemplate({book, shelf} : { book: LibEl, shelf: string }) {
  
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const progress = (book.Pages / book.Book.Pages) * 100;
  useEffect(() => {
    // Delay setting width so animation happens
    setTimeout(() => setAnimatedWidth(progress), 50);
  }, [progress]); // Runs when progress updates

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-[#D0BCA9] p-3 md:p-4 rounded-lg lg:w-full lg:h-[300px] md:h-[250px] md:w-[250px] xl:h-full sm:h-[350px] sm:w-[250px] xs:h-[350px] xs:w-[180px]">
      {/* Book Image */}
      <div className="w">
        <Image
          src={book.Book.Image}
          alt={book.Book.Title}
          width={350}
          height={250}
          className="rounded-lg object-cover xs:w-[130px] sm:w-[300px] md:w-[250px]  3xl:w-auto h-auto"
        />
      </div>

      {/* Book Details */}
        <div className="flex flex-col sm:ml-4 mt-4  sm:mt-0 w-full items-start">
          <h3 className=" 3xl:text-5xl 2xl:text-4xl xl:text-3xl lg:text-2xl font-bold">{book.Book.Title}</h3>
          <p className="3xl:text-2xl 2xl:text-xl xl:text-lg lg:text-md sm:text-sm xs:text-xs">by {book.Book.Author}</p>
          {book.Pages !== undefined && shelf == "READING" && (
            <div className="mt-2 sm:mt-4">
              <div className="absolute top-0 left-0 h-2 w-full bg-gray-500 rounded-t-lg overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-2 bg-green-500 transition-all ${animatedWidth>95?"":"rounded-r-full "} duration-1000 ease-out`}
                  style={{ width: `${animatedWidth}%` }}
                ></div>
              </div>

              <div className="mb-3">
                <p className="text-lg font-semibold text-gray-800">Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700 mt-1">{progress.toFixed(2)}%</p>
              </div>

              <div className="mb-3">
                <p className="text-lg font-semibold text-gray-800">Remaining Pages</p>
                <p className="text-xl sm:text-2xl font-bold text-red-700 mt-1">{book.Book.Pages - book.Pages}</p>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}