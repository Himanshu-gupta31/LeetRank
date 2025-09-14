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
    <div
      className={`${
        isMobile
          ? "flex flex-col space-y-4" : "flex flex-row justify-evenly space-x-4 " } items-center`}
    >
      <SignedIn>
        <Link href="/profile">
          <Button className="bg-black text-white p-2 rounded-lg hover:bg-blue-700 ">
            Profile
          </Button>
        </Link>
        <Link href="/globalLeaderboard">
          <Button className="bg-black text-white p-2 rounded-lg hover:bg-blue-700">
            Leaderboard
          </Button>
        </Link>
        <Link href="/rooms">
          <Button className="bg-black text-white p-2 rounded-lg hover:bg-blue-700">
            Custom Room
          </Button>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/1v1">
                <Button className="bg-black text-white p-2 rounded-lg hover:bg-blue-700">
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
          <Button className="bg-black text-white p-2 rounded-lg hover:bg-red-600">
            Sign out
          </Button>
        </SignOutButton>
      </SignedIn>
  
      <SignedOut>
        <Link href="/sign-up">
          <Button className="bg-white text-black border border-black hover:bg-green-600 transition-colors">
            Sign Up
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button className="bg-white text-black hover:bg-green-600 transition-colors">
            Sign In
          </Button>
        </Link>
      </SignedOut>
    </div>
  );
  

  return (
    <nav className="w-full border-b border-neutral-600 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <ChartNoAxesCombined className="h-6 w-6" />
            <p className="font-bold pl-2">LeetRank</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavButtons />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="bg-neutral-700 p-2 rounded-lg hover:bg-neutral-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <NavButtons isMobile={true} />
          </div>
        </div>
      )}
    </nav>
  );
}