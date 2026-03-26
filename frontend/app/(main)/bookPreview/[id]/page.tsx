"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery, gql, useMutation } from '@apollo/client';
import Loading from "../../../loading";
const GetBook = gql`
    query GetBook($id: Int!) {
        getBook(id: $id) {
            Id
            Title
            Author
            Image
            Pages
            Description
            Genre {
                Name
            }
        }
    }
`;

const SaveBook = gql`
    mutation AddBookToShelf($bookId: Int!, $shelf: String!) {
        addBookToShelf(BookId: $bookId, Shelf: $shelf)
    }
`;

export default function Library() {
    const { id } = useParams();
    const validId = Array.isArray(id) ? id[0] : id;
    const numericId = validId ? parseInt(validId, 10) : null;
    const { data, loading, error } = useQuery(GetBook, {
        variables: { id: numericId },
    });
    
    if (!validId) return <p>Book ID is missing</p>;
          
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

    const dataB = {
        "image": data.getBook.Image,
        "title": data.getBook.Title,
        "description": data.getBook.Description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nulla turpis, dapibus non vehicula sed, elementum vitae lacus. Vestibulum id egestas augue. Donec luctus tellus ac convallis feugiat. Aliquam efficitur ac quam eget placerat. Integer non leo dictum, finibus enim in, tempor ligula. Vivamus scelerisque quis nibh eget pretium. Sed hendrerit arcu arcu, vel facilisis nibh aliquam a. Praesent eu sodales lacus, at ultrices erat. Duis auctor commodo turpis vel lobortis. Praesent dapibus, massa non fermentum pretium, sem purus bibendum risus, quis commodo neque sapien at augue. Nulla nec mauris diam. Vestibulum orci lorem, elementum condimentum consequat quis, scelerisque nec erat. Sed et maximus elit, eget fringilla augue.",
        "pages":  data.getBook.Pages,
        "author":  data.getBook.Author,
        "genres": data.getBook.Genre
    }
    
    return (
        <main className="bg-black text-gray-200 py-8 lg:py-12">
            <div className="text-black grid grid-cols-1 lg:grid-cols-1 mx-auto gap-8 w-full md:w-3/4 lg:w-2/3 xl:w-2/4 min-h-screen">
                <div className="grid grid-cols-[0.8fr_2.5fr] xl:gap-4">
                    <div className="xl:p-4 text-white">
                        <div className="w-full sm:w-auto">
                            <Image
                                src={dataB.image}
                                alt={dataB.title}
                                width={350}
                                height={250}
                                className="rounded-lg object-cover w-full sm:w-[200px] md:w-[250px] lg:w-[350px] h-auto"
                            />
                        </div>
                        <div className="py-2">
                            <CustomDropdownButton bookId={Number(data.getBook.Id)}/>
                        </div>
                    </div>
                    <div className="p-4 text-white">
                        <h1 className="text-4xl font-inter mb-0 text-left">{dataB.title}</h1>
                        <div className="text-xl">{dataB.author}</div>
                        <p className="text-md">{dataB.pages} pages</p>
                        <div className="flex gap-2 flex-wrap">
                            {dataB.genres.map((value:any) => (
                                <div className="bg-gray-400 items-center justify-center rounded-lg px-2 py-0.3" key={value.Name}>{value.Name}</div>
                            ))}
                        </div>
                        <div className="rounded-xl border-white border-2 my-2">
                            <h2 className="items-center justify-center flex pt-2">Description:</h2>
                            <p className="p-4 pt-2 whitespace-pre-wrap">
                                {dataB.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

function CustomDropdownButton({ bookId }: { bookId: number }) {
    const [saveBook] = useMutation(SaveBook);

    async function AddBookToShelf(id: number, shelf: string) {
        try {
            const { data } = await saveBook({ variables: { bookId: id, shelf } });
            //console.log("Book saved:", data);
        } catch (err) {
            console.error("Error saving book:", err);
        }
    }

    const [isOpen, setIsOpen] = useState(false);
    let closeTimeout: NodeJS.Timeout | null = null;
  

    function handleMouseLeave() {
        closeTimeout = setTimeout(() => {
        setIsOpen(false);
        }, 200);
    }
    function handleMouseEnter() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
        }
    }

    return (
        <div className="relative inline-flex w-full">

            {/* Main Button */}
            <button onClick={()=>AddBookToShelf(bookId, "WISHLIST")} className="bg-[#D0BCA9] text-white border border-[#D0BCA9] rounded-l-md px-6 py-3 hover:bg-[#bb9e84] focus:outline-none whitespace-nowrap w-full">
                Want to read
            </button>

            {/* Dropdown Button */}
            <div className="relative">
                <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black border border-gray-300 rounded-r-md py-3 text-lg whitespace-nowrap focus:outline-none"
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                >
                    ▼
                </button>

                {/* Dropdown Items */}
                {isOpen && (
                    <div className="absolute left-0 top-full mt-1 w-40 bg-black border border-gray-300 rounded-md shadow-lg"
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}> 
                        <ul className="py-1">
                            <li onClick={()=>AddBookToShelf(bookId, "READ")} className="px-4 py-2 hover:bg-gray-800 cursor-pointer border-b-2">Read</li>
                            <li onClick={()=>AddBookToShelf(bookId, "READING")} className="px-4 py-2 hover:bg-gray-800 cursor-pointer">Currently reading</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

