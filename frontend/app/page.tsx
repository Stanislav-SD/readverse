"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const userLoggedIn = false;

  useEffect(() => {
    if (userLoggedIn) {
      router.push('/dashboard');
    }
  }, [userLoggedIn, router]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black">
      
      <div className="absolute inset-0 bg-cover bg-no-repeat bg-center blur-[20px]"  
        style={{ backgroundImage: 'url(/home/background.jpg)' }}></div>

      <div className="relative z-10 text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-['Inter'] mb-6 text-center px-4">
        ReadVerse
      </div>

      <div className="relative z-10 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-light font-interlight text-center max-w-md sm:max-w-lg mb-10 px-4">
        “Books are a uniquely portable magic.”
      </div>

      <Link href="/signin" 
        className="relative z-10 w-56 sm:w-64 md:w-72 lg:w-80 h-14 sm:h-16 md:h-18 lg:h-20 bg-[#6f4e37] rounded-3xl border-4 border-[#6f4e37] flex items-center justify-center hover:bg-[#5c3e2c] transition-all"
      >
        <div className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-light font-['Inter']">
          Get Started
        </div>
      </Link>
    </div>
  );
}
