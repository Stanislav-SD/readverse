import { Book } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useMutation, gql } from '@apollo/client';
import Image from "next/image";

const ChangeBookshelf = gql`
  mutation Mutation($bookId: Int!, $time: Int!, $pages: Int!) {
    saveNewReadingSession(BookId: $bookId, Time: $time, Pages: $pages)
  }
`;
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
const TimerStart =({ book, onClose }: {book: LibEl;  onClose: () => void;} ) => {
  const [reading, setReading] = useState(false);
  const [pause, setPause] = useState(false)
  const [times, setTimes] = useState([0, 0, 0]);
  const [saveBook] = useMutation(ChangeBookshelf);
  const [value, setValue] = useState<number>(book.Pages);
  async function SaveNewSession() {
    try {
      const f = times[2]+times[1]*60+times[0]*60;
      await saveBook({ variables: { bookId: book.Book.Id, time: f, pages: Number(value-book.Pages)  } });
      onClose();
    } catch (err) {
      console.error("Error saving book:", err);
    }
  }

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const repeatFunction = () => {
      setTimes(prevTimes => {
        const newTimes = [...prevTimes];
    
        newTimes[2] += 1;
    
        if (newTimes[2] > 59) {
          newTimes[1] += 1;
          newTimes[2] = 0;
    
          if (newTimes[1] > 59) {
            newTimes[0] += 1;
            newTimes[1] = 0;
          }
        }
    
        // Only return newTimes if it has actually changed
        if (JSON.stringify(newTimes) !== JSON.stringify(prevTimes)) {
          return newTimes;
        } else {
          return prevTimes; // Return the previous state if there’s no change
        }
      });
    };

    if (reading) {
      if (!pause) {
        if (!intervalIdRef.current) { // Prevent multiple intervals
          intervalIdRef.current = setInterval(repeatFunction, 1000);
        }
      } else {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      }
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
     // Reset time when not reading
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [reading, pause]);
  
  const formattedTimer = () => {
    return `${times[0] < 10 ? `0${times[0]}` : times[0]}:${times[1] < 10 ? `0${times[1]}` : times[1]}:${times[2] < 10 ? `0${times[2]}` : times[2]}`;
  };

  const handleTimer = () => {
    setReading(!reading);
    setPause(false);
  }
  function formatTime(): string {
    const hours = Math.floor(book.TimeLeftToFinishBook / 3600);
    const minutes = Math.floor((book.TimeLeftToFinishBook % 3600) / 60);
    const remainingSeconds = book.TimeLeftToFinishBook % 60;
    
    return `${hours.toFixed(0)}h ${minutes.toFixed(0)}m ${remainingSeconds.toFixed(0)}s`;
  }

  return (
    <div className='flex items-center justify-around w-auto h-auto rounded-full my-5 mx-5 space-x-5'>
      <Image 
        src={book.Book.Image} 
        alt={book.Book.Image} 
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-auto max-w-full max-h-full flex items-center justify-around"/>
      <div className="text-black">
        <label className='flex gap-3 text-5xl'>{book.Book.Title}</label> 
        <label className='flex gap-3 text-3xl'>{book.Book.Author}</label>
        {!reading && !pause && (times[0] > 0 || times[1] > 0 || times[2] > 0) && (
          <>
            <input
              type="range"
              min="0"
              max={book.Book.Pages} 
              value={value}
              onChange={(e) => setValue(Math.max(book.Pages, Number(e.target.value)))}
              className="w-full h-1.5 bg-gradient-to-r from-gray-500 to-black rounded-full appearance-none cursor-pointer 
                transition-all 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:transition-all 
                [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-125 
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border 
                [&::-webkit-slider-thumb]:border-gray-200 [&::-webkit-slider-thumb]:shadow-lg 
                [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 
                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-gray-200 
                [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:active:scale-125"
            />
            <span className="w-8 text-center flex items-center justify-center m-auto text-5xl font-extrabold tracking-wide">{value}</span>
            <div className="flex gap-2 items-center justify-center mt-4">
              <button className="bg-zinc-800 rounded-md p-3 mt-4 font-interlight text-green-400" onClick={SaveNewSession}>Confirm</button>
              <button className="bg-zinc-800 rounded-md p-3 mt-4 font-interlight text-red-700" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
        {((times[0] == 0 && times[1] == 0 && times[2] == 0) || reading) && (
          <>
            <label className={`flex gap-3 items-center justify-center p-4 bg-gradient-to-r border-black border-4 text-gray-800 rounded-lg shadow-xl ${reading ? "" : "hidden"} ${pause? "animate-pulse": ""}`}>
              <span className="text-5xl font-extrabold tracking-wide">{formattedTimer()}</span>
            </label>
            <div className="flex flex-col gap-4 items-center justify-center mt-4">
              <div className="flex gap-2">
                <button
                  className={`bg-zinc-800 text-slate-300 rounded-md p-3 font-interlight ${reading ? "" : "hidden"}`}
                  onClick={() => setPause(!pause)}
                >
                  {pause ? "Unpause " : "Pause "}
                </button>
                <button onClick={handleTimer} className="bg-zinc-800 rounded-md p-3 font-interlight">
                  <span className={`${reading ? "text-red-700 font-inter" : "text-green-400"}`}>
                    {reading ? "Stop " : "Start "}
                  </span>
                  <span className="text-white">timer</span>
                </button>
              </div>

              {book.TimeLeftToFinishBook > 0 && (
                <div className="block text-center">
                  <label className="text-xl font-semibold text-gray-800">
                    If you continue reading at your current speed, you will finish the book in:
                    <span className="block text-2xl font-bold text-green-600 mt-1">{formatTime()}</span>
                  </label>
                </div>
              )}
            </div>

          </>
        )}
      </div>   
    </div>
  )
}

export default TimerStart;