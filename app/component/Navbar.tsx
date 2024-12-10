"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { ChartNoAxesCombined, Medal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="w-full border-b border-neutral-600 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <ChartNoAxesCombined className="h-6 w-6" />
            <p className="font-bold pl-2">LeetRank</p>
          </div>

          <SignedIn>
            <div className="flex justify-center items-center space-x-2">
              <Link href={"/profile"}>
                <Button className="bg-neutral-700 p-2 rounded-lg w-full hover:bg-red-600">
                  Profile
                </Button>
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={"/1v1"}>
                      <Button className="bg-neutral-700 p-2 rounded-lg w-full hover:bg-red-600">
                        <Medal /> 1v1
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    Compare your leetcode performance with anyone!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <SignOutButton>
                <div className="flex items-center justify-end w-[6rem]">
                  <button className="bg-neutral-700 p-2 rounded-lg w-full hover:bg-red-600">
                    Sign out
                  </button>
                </div>
              </SignOutButton>
            </div>
          </SignedIn>

          <SignedOut>
            {/* Desktop Links */}
            <div className="hidden md:block sm:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/sign-up">
                  <button className="bg-neutral-700 border border-black px-3 py-2 rounded-md hover:bg-green-600 transition-colors">
                    Sign Up
                  </button>
                </Link>
                <Link href="/sign-in">
                  <button className="bg-neutral-700 border border-black px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </SignedOut>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-neutral-700 p-2 rounded-lg hover:bg-neutral-600"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="block md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/sign-up">
              <button className="block w-full text-left bg-neutral-700 border border-black px-3 py-2 rounded-md hover:bg-neutral-600 transition-colors">
                Sign Up
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="block w-full text-left bg-neutral-700 border border-black px-3 py-2 rounded-md hover:bg-neutral-600 transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
