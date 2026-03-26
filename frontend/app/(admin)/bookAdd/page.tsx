"use client";
import React, { useState} from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBarcode } from "react-icons/fa";
import Loading from "../../loading";

interface Genre {
    Id: number;
    Name: string;
}

interface Book {
    Id: number;
    Title: string;
    Author: string;
    Image: string;
    Pages: number;
    Published: string;
    Description?: string;
    ISBN10?: string;
    ISBN13?: string;
    Genre: { Name: string }[];
}

interface BooksData {
    getGenres: Genre[];
    getBooks: Book[];
}

/** --- GraphQL Operations --- **/
const GET_BOOKS_DATA = gql`
    query GetBooksData {
        getGenres { Id Name }
        getBooks(take: 50, top: false) { 
            Id Title Image Author Pages Published Description
            Genre { Name }
        }
    }
`;

const ADD_BOOK = gql`
    mutation AddBook($Title: String!, $Image: String!, $Author: String!, $Published: String, $Pages: Int!, $Description: String, $ISBN10: String, $ISBN13: String, $Genre: [String]) {
        addBook(Title: $Title, Image: $Image, Author: $Author, Published: $Published, Pages: $Pages, Description: $Description, ISBN10: $ISBN10, ISBN13: $ISBN13, Genre: $Genre)
    }
`;

const UPDATE_BOOK = gql`
    mutation UpdateBook($id: Int!, $title: String!, $image: String!, $author: String!, $genre: String!, $published: String!, $pages: Int!) {
        updateBook(BookId: $id, Title: $title, Image: $image, Author: $author, Genre: $genre, Published: $published, Pages: $pages)
    }
`;

const DELETE_BOOK = gql`
    mutation DeleteBook($id: Int!) {
        deleteBook(BookId: $id)
    }
`;

export default function bookAdd() {
    const { data, loading, refetch } = useQuery<BooksData>(GET_BOOKS_DATA);
    const [addBook] = useMutation(ADD_BOOK);
    const [updateBook] = useMutation(UPDATE_BOOK);
    const [deleteBook] = useMutation(DELETE_BOOK);

    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({
        title: "", author: "", image: "", published: "", pages: 1, 
        description: "", isbn10: "", isbn13: "", genres: [] as string[]
    });

    const handleEdit = (book: Book) => {
        setEditId(book.Id);
        const dateStr = book.Published ? new Date(parseInt(book.Published)).toISOString().split('T')[0] : "";
        setForm({
            title: book.Title,
            author: book.Author,
            image: book.Image,
            published: dateStr,
            pages: book.Pages,
            description: book.Description || "",
            isbn10: book.ISBN10 || "",
            isbn13: book.ISBN13 || "",
            genres: (book.Genre ?? []).map(g => g.Name)
        });
    };

    const resetForm = () => {
        setEditId(null);
        setForm({ title: "", author: "", image: "", published: "", pages: 1, description: "", isbn10: "", isbn13: "", genres: [] });
    };
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateBook({
                    variables: {
                        id: editId,
                        title: form.title,
                        image: form.image,
                        author: form.author,
                        published: form.published,
                        pages: form.pages,
                        genre: form.genres[0] || "Uncategorized"
                    }
                });
            } else {
                await addBook({
                    variables: {
                        Title: form.title,
                        Image: form.image,
                        Author: form.author,
                        Published: form.published,
                        Pages: form.pages,
                        Description: form.description,
                        ISBN10: form.isbn10,
                        ISBN13: form.isbn13,
                        Genre: form.genres
                    }
                });
            }
            resetForm();
            refetch();
        } catch (err) {
            alert(err instanceof Error ? err.message : "An error occurred");
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-[#121313] text-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT: FORM */}
            <div className="bg-[#1e1f1f] border border-zinc-800 p-8 rounded-xl h-fit sticky top-6">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    {editId ? <FaEdit className="text-blue-500" /> : <FaPlus className="text-green-500" />}
                    {editId ? "Update Book" : "Add New Book"}
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input placeholder="Book Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-black w-full p-3 border border-zinc-700 rounded-md focus:border-blue-500 outline-none"/>
                    <input placeholder="Author Name" required value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="bg-black w-full p-3 border border-zinc-700 rounded-md focus:border-blue-500 outline-none"/>
                    <input placeholder="Cover Image URL" required value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="bg-black w-full p-3 border border-zinc-700 rounded-md focus:border-blue-500 outline-none"/>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={form.published} onChange={e => setForm({...form, published: e.target.value})} className="bg-black w-full p-3 border border-zinc-700 rounded-md text-zinc-400"/>
                        <input type="number" required placeholder="Pages" value={form.pages} onChange={e => setForm({...form, pages: parseInt(e.target.value)})} className="bg-black w-full p-3 border border-zinc-700 rounded-md"/>
                    </div>

                    {/* ISBN SECTION */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <FaBarcode className="absolute left-3 top-4 text-zinc-600" />
                            <input 
                                placeholder="ISBN10" 
                                value={form.isbn10} 
                                inputMode="numeric"
                                className="bg-black w-full p-3 pl-10 border border-zinc-700 rounded-md focus:border-blue-500 outline-none"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val) && val.length <= 10) setForm({...form, isbn10: val});
                                }}
                            />
                        </div>
                        <div className="relative">
                            <FaBarcode className="absolute left-3 top-4 text-zinc-600" />
                            <input 
                                placeholder="ISBN13" 
                                value={form.isbn13} 
                                inputMode="numeric"
                                className="bg-black w-full p-3 pl-10 border border-zinc-700 rounded-md focus:border-blue-500 outline-none"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val) && val.length <= 13) setForm({...form, isbn13: val});
                                }}
                            />
                        </div>
                    </div>

                    <textarea placeholder="Description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="bg-black w-full p-3 border border-zinc-700 rounded-md h-24"/>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-400">Genres</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-black border border-zinc-800 rounded-md max-h-32 overflow-y-auto">
                            {data?.getGenres.map((g) => (
                                <button key={g.Id} type="button" 
                                    onClick={() => setForm({...form, genres: form.genres.includes(g.Name) ? form.genres.filter(x => x !== g.Name) : [...form.genres, g.Name]})}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${form.genres.includes(g.Name) ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                                    {g.Name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className={`w-full p-4 rounded-md font-bold transition-all ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                        {editId ? "UPDATE BOOK" : "SAVE BOOK"}
                    </button>
                    {editId && <button onClick={resetForm} type="button" className="w-full text-zinc-500 mt-2 flex items-center justify-center gap-2"><FaTimes /> Cancel</button>}
                </form>
            </div>

            {/* RIGHT: LIST */}
            <div className="space-y-4 pb-20 overflow-y-auto max-h-screen">
                <h2 className="text-2xl font-bold text-zinc-400">Inventory</h2>
                {data?.getBooks.map((book) => (
                    <div key={book.Id} className="bg-[#1e1f1f] p-4 rounded-xl border border-zinc-800 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <img src={book.Image} className="w-12 h-16 object-cover rounded shadow-md bg-zinc-900" alt="cover"/>
                            <div>
                                <h3 className="font-bold text-zinc-100">{book.Title}</h3>
                                <p className="text-xs text-zinc-500">ISBN13: {book.ISBN13 || "N/A"}</p>
                                <div className="flex gap-1 mt-1">
                                    {book.Genre?.slice(0, 2).map(g => (
                                        <span key={g.Name} className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{g.Name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleEdit(book)} className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"><FaEdit size={18} /></button>
                            <button onClick={async () => { if(confirm("Delete?")) { await deleteBook({variables:{id: book.Id}}); refetch(); }}} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><FaTrash size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}