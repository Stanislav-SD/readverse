"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AuthLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const { isLoggedIn, logout, logoutLoading } = useAuth()!;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleAuthCheck = async () => {
      const ok = await isLoggedIn();
      // Skip status update if already on the sign-in page
      if (ok && !logoutLoading) {
        router.push("/dashboard");
      }
    };

    handleAuthCheck();
  }, [isLoggedIn, logoutLoading, pathname]);

  return (
    <div className="h-screen flex justify-center bg-smooth-gradient items-center shadow-md login-bg">
      <div className="absolute bg-[#D9D9D9] xs:w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-cover bg-center sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] p-6 rounded-md shadow-md text-black">
        {children}
      </div>
    </div>  
  );
};