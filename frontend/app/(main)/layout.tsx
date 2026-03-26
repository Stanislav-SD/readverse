"use client";
import React, { useEffect } from "react";
import TopNavbar from "../components/navbar";
import { useAuth } from "@/app/context/AuthContext";
import { gql, useMutation } from "@apollo/client";
import { usePathname } from "next/navigation";

const UPDATE_STATUS = gql`
  mutation UpdateStatus($status: String!) {
    updateStatus(status: $status)
  }
`;

export default function MainLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const { isLoggedIn, logout, logoutLoading } = useAuth()!;
  const [updateStatus] = useMutation(UPDATE_STATUS);
  const pathname = usePathname();

  useEffect(() => {
    const handleAuthCheck = async () => {
      const ok = await isLoggedIn();
      // Skip status update if already on the sign-in page
      if (!ok && !logoutLoading && pathname !== "/signin") {
        //console.log("in");
        logout();
      } else if (ok && pathname !== "/signin") {
        await updateStatus({ variables: { status: "ONLINE" } });
      }
    };

    handleAuthCheck();
  }, [isLoggedIn, logoutLoading, pathname]);

  return (
    <>
      <TopNavbar/>
      {children}
    </>  
  );
};