"use client"
import { ChartNoAxesCombined } from "lucide-react"
import React from "react"
function Navbar(){
    return (
        <div className="w-full h-[3.5rem] border-b border-neutral-600">
          <div className="flex p-2 justify-between items-center px-4">
            <div className="flex items-center">
            <ChartNoAxesCombined />
            <p className="font-bold pl-2">LeetRank</p>
            </div>
            <div className="flex items-center">
              <button className="bg-neutral-700 border border-black px-2 py-2 rounded-md mx-2 hover:bg-neutral-500">Sign Up</button>
              <button className="bg-neutral-700 border border-black px-2 py-2 rounded-md mx-2 hover:bg-neutral-500">Sign In</button>
            </div>
          </div>
        </div>
    )
}
export default Navbar