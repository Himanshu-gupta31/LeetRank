import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./component/Navbar";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/react"
import Footer from "./component/Footer";

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
  title: "LeetRank",
  description: "LeetRank - A platform where you can get your college leetcode rank! Compare your leetcode performance with your peers.",
  openGraph: {
    title: "LeetRank",
    description: "Get your college leetcode rank!",
    images: [
      {
        url: "https://leet-rank.vercel.app/image.png",
        width: 1200,
        height: 630,
        alt: "LeetRank Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeetRank",
    description: "Get your college leetcode rank!",
    images: ["https://leet-rank.vercel.app/image.png"],
    creator: "@Himanshuu3112",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="bg-black text-white">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics/>
        <Navbar/>
        {children}
        {/* <Footer/> */}
      </body>
    </html>
    </ClerkProvider>
  );
}
