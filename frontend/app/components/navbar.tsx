"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GiHamburgerMenu } from 'react-icons/gi';
import { useAuth } from "@/app/context/AuthContext";

const TopNavbar = () => {
    const { logout } = useAuth();
    const [menuState, setMenuState] = useState(false);
    const [profileState, setProfileState] = useState(false);
    const navItems = [
        { href: "/dashboard", tooltip: "Dashboard", css: "mt-4 mb-4 hover:text-[#684934] transition-colors delay-50"},
        { href: "/bookGallery", tooltip: "Books", css: "m-4 hover:text-[#684934] transition-colors delay-50" },
        { href: "/dashboard", tooltip: "Readverse", css: "text-white font-boomster text-[60px] mr-4 ml-4 hover:text-gray-300 transition-colors delay-50" },
        { href: "/library", tooltip: "Library", css: "m-4 hover:text-[#684934] transition-colors delay-50" },
        { href: "/badges", tooltip: "Challenges", css: "mt-4 mb-4 hover:text-[#684934] transition-colors delay-50" },
    ]

    const hiddenNavItems = [
        { href: "/dashboard", tooltip: "Dashboard", css: "mt-4 mb-4 hover:text-[#684934] transition-colors delay-50"},
        { href: "/bookGallery", tooltip: "Books", css: "m-4 hover:text-[#684934] transition-colors delay-50" },
        { href: "/library", tooltip: "Library", css: "m-4 hover:text-[#684934] transition-colors delay-50" },
        { href: "/badges", tooltip: "Challenges", css: "mt-4 mb-4 hover:text-[#684934] transition-colors delay-50" },
    ]

    const accountItems = [
        { tooltip: "Friends", href: "/friends"},
        { tooltip: "Profile", href: "/profile"},
        { tooltip: "Logout", href: "#", action: async () => await logout()},
    ]
    const handleMenuEvent = () => {
        setProfileState(!profileState);
        menuState && setMenuState(false);
    }
    const hiddenMenuEvent = () => {
        setMenuState(!menuState);
        profileState && setProfileState(false);
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) { // Tailwind 'xl'
                setMenuState(false);
            }
        };
    
        window.addEventListener("resize", handleResize);
        handleResize();
    
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    

    return(
        // Tva e za glavniq navbar (backgrounda)
        <div className="sticky top-0 z-50 bg-navbar-gradient border-b-4 border-gray-500 p-10 h-16 flex items-center justify-between px-2 lg:px-5 w-full select-none">
            {/* Tva e za logoto/'readverse' texta */}
            <div className="absolute left-1/2 transform -translate-x-1/2 lg:flex mx-auto text-[#D8B9A4] font-navbar text-[40px]">
                {navItems.map(({href, tooltip, css}, index) => (
                    <Link key={index} href={href} className={`${css} ${index !== 2 ? "hidden xl:block" : "block"}`}>
                        <p>{tooltip}</p>
                    </Link>
                ))}
            </div>

            <div>
                <GiHamburgerMenu className="hover:cursor-pointer w-6 h-6 ml-3 xl:hidden" onClick={hiddenMenuEvent}></GiHamburgerMenu>

                <div className={`absolute top-16 duration-500 border-solid border-gray-500 bg-[#473324] w-40 ${menuState ? "max-h-80 " : "max-h-0"} left-2 lg:left-3 rounded-lg overflow-hidden text-white`}>
                    {hiddenNavItems.map(({tooltip, href}, index) => (
                        <Link key={index} href={href} className="flex justify-start items-center  w-full h-16 bg-transparent border-b-2 pl-4 text-gray-40 gap-3 hover:border-[#3f2c17] duration-500">
                            {tooltip}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center ml-auto">
                <div onClick={handleMenuEvent} className="w-10 h-10 bg-gray-3 mr-3 flex items-center justify-center rounded-full overflow-hidden cursor-pointer">
                    <Image src="/avatars/defaultAvatar.jpg" alt="Profile" width={40} height={40}/>
                </div>

                <div className={`absolute top-16 duration-500 border-solid border-gray-500 bg-[#473324] w-40 ${profileState ? "max-h-80" : "max-h-0"} right-0 lg:right-1 rounded-lg overflow-hidden text-white`}>
                    {accountItems.map(({tooltip, href, action}, index) => (
                        <Link key={index} href={href} onClick={action || undefined} className="flex justify-start items-center w-full h-16 bg-transparent border-b-2 pl-4 text-gray-40 gap-3 hover:border-[#2C3251] duration-500">
                            {tooltip}
                        </Link>
                    ))}
                </div>
             </div>
        </div>
    );
};

export default TopNavbar;