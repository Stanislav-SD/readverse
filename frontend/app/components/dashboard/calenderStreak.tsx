"use client";
import { MouseEvent, useEffect, useState, useMemo } from 'react';
import '@/app/style/scroll.css';

const StreakCalendar = ({streak}: {streak:{[key: string]:number}}) => {
    const [legendHovered, setLHovered] = useState(false);
    const [dateHovered, setDHovered] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [info, setInfo] = useState("");

    const date = new Date();
    //console.log(date)
    const year = Object.keys(streak)[0]?.split('-')[0] || date.getFullYear();
    const month = Object.keys(streak)[0]?.split('-')[1] || (date.getMonth() + 1).toString();
    const selectedYear = Number(year) || 2025;
    const selectedMonth = Number(month) || 1;

    const firstDay = useMemo(() => new Date(date.getFullYear(), selectedMonth - 1, 1).getDay(), [date, selectedMonth]);
    const lastDay = useMemo(() => new Date(date.getFullYear(), selectedMonth, 0).getDay(), [date, selectedMonth]);
    const numOfWeeks = useMemo(() => Math.ceil((new Date(date.getFullYear(), selectedMonth, 0).getDate() + firstDay) / 7), [date, firstDay, selectedMonth]);

    const streaksLegend = {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      colors: ["f0f0f0", "c4edde", "7ac7c4", "f73859", "384259"]
    };

    const squareLogic = (index: number, numWeek: number) => {
        const formattedMonth = selectedMonth.toString().padStart(2, '0');
        const formattedDay = (numWeek * 7 + index + 1 - firstDay).toString().padStart(2, '0');
        const currPages = streak[`${selectedYear}-${formattedMonth}-${formattedDay}`] || 0;

        const currWeekNumber = Math.ceil((Math.floor((date.getTime() - new Date(date.getFullYear(), date.getMonth(), 1).getTime()) / (24 * 60 * 60 * 1000)) + 1) / 7);
        return `${(index < firstDay && numWeek === 0) || (index > lastDay && numWeek === numOfWeeks - 1) ? "bg-[#000000] text-transparent cursor-default bg-opacity-15" : 
            `border-[1px] border-black bg-opacity-70 
            ${index === date.getDay() && numWeek === currWeekNumber ? "border-[3px] border-black bg-opacity-70" : ""}
            ${currPages < 15 ? "bg-[#f0f0f0]" :
            `${currPages < 40 ? "bg-[#c4edde]" :
            `${currPages < 100 ? "bg-[#7ac7c4]" :
            `${currPages < 200 ? "bg-[#f73859]" :
            "bg-[#384259]"}`}`}`}`}`;
    }

    const handleMouseMovement = (e: MouseEvent | TouchEvent) => {
        // Check if it's a touch event or mouse event
        const isTouch = 'touches' in e; // Check if it is a TouchEvent
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;

        let x = 0, y = 0;

        if (isTouch) {
            const touch = (e as TouchEvent).touches[0]; // Cast to TouchEvent
            x = touch.clientX;
            y = touch.clientY;
        } else {
            x = (e as MouseEvent).clientX; // Cast to MouseEvent
            y = (e as MouseEvent).clientY;
        }

        // Set coordinates considering scrolling
        setCoords({ x: x + scrollX, y: y + scrollY });
    };

    const setDateInfo = (index: number) => {
        const daysInMonth = (numOfWeeks - 1) * 7 + lastDay - firstDay + 1;
        if (index > 0 && index <= daysInMonth){
            const formattedMonth = selectedMonth.toString().padStart(2, '0');
            const formattedDay = index.toString().padStart(2, '0');
            const currPages = streak[`${selectedYear}-${formattedMonth}-${formattedDay}`] || 0;
            setInfo(`You've read ${currPages} pages`);
        }
        else setInfo("")
    }

    useEffect(() => {
        const calendarElement = document.querySelector('.react-activity-calendar__scroll-container');
        if (calendarElement) {
            calendarElement.classList.add('custom-scroll-container');
            setTimeout(() => {
                calendarElement.scrollTo({ left: calendarElement.scrollWidth, behavior: 'smooth' });
            }, 400);//ms
        }   
    }, []);
    

    return (
        <div className='flex flex-col items-center justify-center mb-[40px] w-full'>
            <div className='flex flex-row flex-wrap justify-center mb-4'>
                {streaksLegend.days.map((day, index) => (
                    <span key={index} className={`bg-transparent items-center justify-center font-interlight text-red xs:m-2 xxs:m-[11px] rounded flex sm:w-[58px] sm:h-[30px] sm:text-[20px] xs:w-[40px] xs:h-[20px] xs:text-[18px] xxs:w-[18px] xxs:h-[9px] xxs:text-[15px]`}>
                        {day}
                    </span>
                ))}
            </div>
            <div className='flex flex-col'>
                {Array.from({ length: numOfWeeks }, (_, numWeeks) => (
                    <div key={numWeeks} className='flex'>
                        {Array.from({ length: 7 }, (_, index) => (
                            <div key={index} onMouseEnter={() => setDateInfo(numWeeks * 7 - firstDay + index + 1)}>
                                <button 
                                    key={numWeeks * 7 + index} 
                                    className={`${squareLogic(index, numWeeks)} flex items-center justify-center font-mono font-bold sm:w-[60px] sm:h-[60px] xs:w-[40px] xs:h-[40px] xxs:w-[30px] xxs:h-[30px] xs:m-2 m-1 rounded`} 
                                    onMouseMove={handleMouseMovement} 
                                    onMouseEnter={() => setDHovered(true)} 
                                    onMouseLeave={() => setDHovered(false)}
                                >
                                    {numWeeks * 7 - firstDay + index + 1}
                                </button>
                            </div>
                        ))}
                    </div>
                ))}

                {dateHovered && (
                    <div className={`absolute text-sm bg-black ${info === "" ? "bg-opacity-0" : "bg-opacity-100"} text-white px-3 py-2 rounded-md`}
                        style={{
                            left: coords.x + 10 + 'px', // 10px offset from cursor
                            top: coords.y + 10 + 'px',  // 10px offset from cursor
                        }}
                    >
                        {info}
                    </div>
                )}
            </div>
            <div className='flex flex-row justify-center'>
                <span className={`bg-transparent items-center justify-center xs:text-[20px] text-[15px] h-[30px] m-2 xxs:mt-[30px]  rounded flex`}>
                    <div className='mr-[5px]'>Legend: less</div>
                    {streaksLegend.colors.map((color, index) => (
                        <div key={index} onMouseEnter={() => setInfo(`When you read ${index === 0 ? "up to 15" : `${index === 1 ? "from 15 to 40" : `${index === 2 ? "from 40 to 100" : `${index === 3 ? "from 100 to 200" : "a minimum of 200"}`}`}`} pages in a day`)}>
                            <button key={index} className={`bg-[#${color}] bg-opacity-70 h-[25px] w-[25px] mx-[5px]`}
                                onMouseMove={handleMouseMovement}
                                onMouseEnter={() => setLHovered(true)}
                                onMouseLeave={() => setLHovered(false)}></button>
                        </div>
                    ))}
                    <div className='ml-[5px]'>more</div>
                </span>
            </div>
            {legendHovered && (
                <div className="absolute text-sm bg-black text-white px-3 py-2 rounded-md"
                    style={{
                        left: coords.x + 10 + 'px', // 10px offset from cursor
                        top: coords.y + 10 + 'px', // 10px offset from cursor
                    }}
                >
                    {info}
                </div>
            )}
        </div>
    );
};

export default StreakCalendar;
