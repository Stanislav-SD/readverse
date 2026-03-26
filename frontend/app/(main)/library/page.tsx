"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import BookTemplate from "@/app/components/books/Book";
import TimerStart from '@/app/components/books/Timer';
import { useQuery, gql } from '@apollo/client';
import AddBook from '@/app/components/books/AddBookToReading';
import Loading from "../../loading";

const GetLibraryBooks = gql`
  query GetLibraryBooks{
    getLibraryBooks {
        Shelf
        Books {
            Book {
                Id
                Title
                Author
                Image
                Pages
            }
            Pages
            ReadTime
            TimeLeftToFinishBook
        }
    }
  }
`;

type Library = {
    Shelf: string;
    Books: LibEl[];
}

type LibEl = {
    Book: Book;
    ReadTime: number;
    Pages: number;
    TimeLeftToFinishBook: number;
}

type Book = {
    Id: number;
    Title: string;
    Author: string;
    Image: string;
    Pages: number;
}

export default function Library() {
    const { data, loading, error, refetch } = useQuery(GetLibraryBooks, {
        fetchPolicy: 'network-only',
    });
    const [editingProgress, setEditingProgress] = useState(false);
    const [selectedBook, setSelectedBook] = useState<[undefined | number, undefined | string]>([undefined, undefined])

    //console.log(data);
    
    const libraryData = useMemo(() => {
        if (!data || !data.getLibraryBooks) return {
          "WISHLIST": [],
          "READING": [],
          "READ": []
        };
        const library: {[key: string]:LibEl[]} = {
          "WISHLIST": [],
          "READING": [],
          "READ": []
        };
        data.getLibraryBooks.forEach((Lib: Library) => {
          library[Lib.Shelf] = Lib.Books;
        });
        return library;
    }, [data]);

    const triggerEditProgress = async (index: number | undefined, category: string) =>{
        await setSelectedBook([index,category])
        setEditingProgress(!editingProgress)
    }

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <main className="flex justify-center items-center h-screen bg-black text-gray-200">
                <p className="text-red-500 text-2xl">Error: {error.message}</p>
            </main>
        );
    }

    return (
        <main className='bg-black'>
            {(editingProgress && selectedBook[1] != undefined && selectedBook[0] != undefined) &&  (
                <>
                    <div className='fixed w-full h-full z-40 bg-black opacity-40' onClick={()=>editingProgress?setEditingProgress(false):false}/>
                    <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#D0BCA9] sm:w-auto xs:w-4/5 w-full h-auto z-50 border-[7px] border-[#918274]'>
                        {(selectedBook[1] == "READING") && (<TimerStart onClose={()=>{setEditingProgress(false); refetch();}} book={libraryData[selectedBook[1]][selectedBook[0]]}/>)}
                        {(selectedBook[1] == "WISHLIST" || selectedBook[1] == "READ") && (<AddBook onClose={()=>{setEditingProgress(false); refetch();}} book={libraryData[selectedBook[1]][selectedBook[0]]}/>)}
                    </div>
                </>
            )}

            <div className={`text-black grid grid-cols-1 ${editingProgress?"blur-sm":""} lg:grid-cols-1 mx-auto gap-8 w-2/3 h-full`}>
                <div className={`text-black bg-black min-h-screen z-10 px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10`}>
                    {/* Library Header */}
                    <h1 className="text-white text-2xl sm:text-`3`xl md:text-4xl font-bold">Library:</h1>
                  
                    {/* Reading Section */}
                    <div className='z-10'>
                        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">Reading:</h2>
                        {libraryData["READING"].length > 0 ? (
                            <Swiper
                                spaceBetween={30}
                                grabCursor={true}
                                slidesPerView={1}
                                breakpoints={{
                                    479: {
                                        slidesPerView: 2,
                                    },
                                }}
                                hashNavigation={{ watchState: true }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                keyboard={{ enabled: true }}
                                navigation={true}
                                modules={[Keyboard, Pagination, Navigation]}
                                className="w-full"
                            >
                                {libraryData["READING"].map((book, index) => (
                                    <div key={index}>
                                        <div key={index} className="swiper-slide">
                                            <SwiperSlide key={book.Book.Title + "-" + index} onClick={() => triggerEditProgress(index, "READING")} className='hover:cursor-pointer'>
                                                <div className='flex h-full w-full items-center justify-center'>
                                                    <BookTemplate book={book} shelf="READING" />
                                                </div>
                                            </SwiperSlide>
                                        </div>
                                    </div>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center text-gray-500 text-xl mt-4">
                              No books currently being read.
                            </div>
                        )}
                    </div>

                    {/* Want to Read Section */}
                    <div>
                        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">Want to read:</h2>
                        {libraryData["WISHLIST"].length > 0 ? (
                            <Swiper
                                spaceBetween={30}
                                grabCursor={true}
                                slidesPerView={1}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 30,
                                    },
                                    1706: {
                                        slidesPerView: 2,
                                        spaceBetween: 40,
                                    }
                                }}
                                hashNavigation={{ watchState: true }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                keyboard={{ enabled: true }}
                                navigation={true}
                                modules={[Keyboard, Pagination, Navigation]}
                                className="px-20"
                            >
                                {libraryData["WISHLIST"].map((book, index) => (
                                    <div key={index}>
                                        <div key={index} className="swiper-slide">
                                            <SwiperSlide key={book.Book.Title + "-" + index} onClick={() => triggerEditProgress(index, "WISHLIST")} className='hover:cursor-pointer'>
                                                <div className='flex h-full w-full items-center justify-center'>
                                                    <BookTemplate book={book} shelf="WISHLIST" />
                                                </div>
                                            </SwiperSlide>
                                        </div>
                                    </div>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center text-gray-500 text-xl mt-4">
                              No books in your wishlist yet.
                            </div>
                        )}
                    </div>
              
                    {/* Finished Section */}
                    <div>
                        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">Finished:</h2>
                        {libraryData["READ"].length > 0 ? (
                            <Swiper
                                spaceBetween={30}
                                grabCursor={true}
                                slidesPerView={1}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 30,
                                    },
                                    1706: {
                                        slidesPerView: 3,
                                        spaceBetween: 40,
                                    }
                                }}
                                hashNavigation={{ watchState: true }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                keyboard={{ enabled: true }}
                                navigation={true}
                                modules={[Keyboard, Pagination, Navigation]}
                                className="px-20"
                            >
                                {libraryData["READ"].map((book, index) => (
                                    <div key={index}>
                                        <div key={index} className="swiper-slide">
                                            <SwiperSlide key={book.Book.Title + "-" + index} onClick={() => triggerEditProgress(index, "READ")} className='hover:cursor-pointer'>
                                                <div className='flex h-full w-full items-center justify-center'>
                                                    <BookTemplate book={book} shelf="READ" />
                                                </div>
                                            </SwiperSlide>
                                        </div>
                                    </div>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center text-gray-500 text-xl mt-4">
                                No books read yet.
                            </div>
                        )}
                    </div>
              </div>     
            </div>
        </main>
    );
};