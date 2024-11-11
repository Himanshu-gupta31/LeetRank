"use client"

import {  SignedOut} from "@clerk/nextjs"
import { ChartNoAxesCombined} from "lucide-react"
import Link from "next/link"
import {  useState } from "react"


export default function Navbar() {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  

  return (
    <nav className="w-full border-b border-neutral-600 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <ChartNoAxesCombined className="h-6 w-6" />
            <p className="font-bold pl-2">LeetRank</p>
          </div>
          <SignedOut>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/sign-up">
                <button className="bg-neutral-700 border border-black px-3 py-2 rounded-md hover:bg-neutral-600 transition-colors">
                  Sign Up
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="bg-neutral-700 border border-black px-4 py-2 rounded-md hover:bg-neutral-600 transition-colors">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
          </SignedOut>
          <div className="md:hidden">
            
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
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
  )
}