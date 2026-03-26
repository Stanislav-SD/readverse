import { AuthProvider } from "@/app/context/AuthContext";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ApolloClientProvider from "@/lib/ApolloProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Readverse",
  description: "Books are a uniquely portable magic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
