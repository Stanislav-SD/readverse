"use client";
import React, { useEffect } from "react";
import TopNavbar from "../components/navbar";
import { useAuth } from "@/app/context/AuthContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Loading from "../loading";

const UPDATE_STATUS = gql`
  mutation UpdateStatus($status: String!) {
    updateStatus(status: $status)
  }
`;

const GET_USER_DATA = gql`
  query Me {
    me {
      Role
    }
  }
`;

export default function MainLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const { isLoggedIn, logout, logoutLoading } = useAuth()!;
  const [updateStatus] = useMutation(UPDATE_STATUS);
  const { data, loading, error } = useQuery(GET_USER_DATA);
  const pathname = usePathname();
  const router = useRouter();

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
  
  useEffect(() => {
    if (!loading && data && router) {
      if (data.me?.Role !== "ADMIN") {
        //console.log("Layout effect: Redirecting non-ADMIN user to /dashboard");
        router.push("/dashboard");
      }
    }
  }, [loading, data, router]);

  if (loading) {
    //console.log("Render: Loading user data...");
    return <Loading />;
  }

  if (error) {
    console.error("Render: Error fetching user data:", error);
    return <div>Error loading user information.</div>;
  }
  
  if (data && data.me?.Role !== "ADMIN") {
    //console.log("Render: User is not ADMIN, waiting for redirect effect.");
    return <Loading />;
  }

  return (
    <div className="bg-black min-h-screen">
      <TopNavbar/>
      {children}
    </div>  
  );
};