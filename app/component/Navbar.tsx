"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { ChartNoAxesCombined, Medal, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const NavButtons = ({ isMobile = false }) => (
    <>
      <SignedIn>

        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } items-center space-x-2 max-sm:space-y-2 `}
        >
          <Link href="/profile" className="w-full">
            <Button
              className={`bg-neutral-700 p-2 rounded-lg hover:bg-red-600 ${
                isMobile ? "w-full" : "w-[6rem] h-[2.5rem]"
              }`}
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center mx-2 max-sm:space-y-2`}>
          <Link href="/profile" className="w-full">
            <Button 
              className={`bg-neutral-700 p-2 rounded-lg hover:bg-red-600 ${isMobile ? 'w-full' : 'w-[6rem] '}`}
            >
              Profile
            </Button>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>

                <Link href="/1v1" className="w-full">
                  <Button
                    className={`bg-neutral-700 py-4 rounded-lg hover:bg-red-600 ${
                      isMobile ? "w-full" : ""
                    }`}
                <Link href="/1v1" className="lg:w-[80%] w-full">
                  <Button 
                    className={`bg-neutral-700 p-2 rounded-lg hover:bg-red-600 ${isMobile ? 'w-full' : ''}`}
                  >
                    <Medal className="mr-2" /> 1v1
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Compare your leetcode performance with anyone!
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <SignOutButton>
            <Button
              className={`bg-neutral-700 py-2 rounded-lg hover:bg-red-600 ${
                isMobile ? "w-full" : "w-[6rem]"
              }`}
            >
              Sign out
            </Button>
          </SignOutButton>
        </div>
      </SignedIn>

      <SignedOut>
        <div className={`${isMobile ? "max-sm:space-y-2" : "flex space-x-4"}`}>
          <Link href="/sign-up" className="w-full">
            <Button
              className={`bg-neutral-700 border border-black hover:bg-green-600 transition-colors ${
                isMobile ? "w-full" : "px-3 py-2"
              }`}
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/sign-in" className="w-full">
            <Button
              className={`bg-neutral-700 border border-black hover:bg-green-600 transition-colors ${
                isMobile ? "w-full" : "px-4 py-2"
              }`}
            >
              Sign In
            </Button>
          </Link>
        </div>
      </SignedOut>
    </>
  );

  return (
    <nav className="w-full border-b border-neutral-600 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center">
              <ChartNoAxesCombined className="h-6 w-6" />
              <p className="font-bold pl-2">LeetRank</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center max-sm:space-x-2">
            <NavButtons />
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="bg-neutral-700 p-2 rounded-lg hover:bg-neutral-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 max-sm:space-y-2">
            <NavButtons isMobile={true} />
          </div>
        </div>
      )}
    </nav>
  );
}
