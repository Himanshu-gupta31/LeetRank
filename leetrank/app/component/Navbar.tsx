"use client"
import { ChartNoAxesCombined } from "lucide-react"
import Link from "next/link"
import React from "react"
function Navbar(){
    return (
        <div className="w-full h-[3.5rem] border-b border-neutral-600 bg-black text-white">
          <div className="flex p-2 justify-between items-center px-4">
            <div className="flex items-center">
            <ChartNoAxesCombined />
            <p className="font-bold pl-2">LeetRank</p>
            </div>
            <div className="flex items-center">
              <Link href={"/sign-in"}>
              <button className="bg-neutral-700 border border-black px-3 py-2 rounded-md mx-2 hover:bg-neutral-500">Sign Up</button>
              </Link>
              <Link href={"/sign-up"}>
              <button className="bg-neutral-700 border border-black px-4 py-2 rounded-md mx-2 hover:bg-neutral-500">Sign In</button>
              </Link>
            </div>
          </div>
        </div>
    )
}
export default Navbar