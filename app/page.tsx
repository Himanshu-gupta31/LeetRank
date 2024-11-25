"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Users, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

export default function Home() {
  const bgColour=['bg-red-500/20', 'bg-blue-500/20', 'bg-green-500/20', 'bg-yellow-500/20', 
  'bg-purple-500/20', 'bg-pink-500/20', 'bg-indigo-500/20', 'bg-teal-500/20']
  const router=useRouter()
  const {isSignedIn,user}=useUser()
  const [grid,setGrid]=useState(Array(64).fill('bg-transparent'))
  
  useEffect(()=>{
     if(isSignedIn){
      router.push("/dashboard")
     }
  },[isSignedIn, router])

  useEffect(()=>{
    const intervalId=setInterval(()=>{
      setGrid(prevcolour=>{
        return prevcolour.map(()=>
        Math.random() > 0.7 ? bgColour[Math.floor(Math.random() * bgColour.length)] : 'bg-transparent'
        )
      })
    },2000)

    return () => clearInterval(intervalId)
  },[])

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className='absolute inset-0 grid grid-cols-8 grid-rows-8 z-0'>
        {grid.map((colour,index)=>(
         <div key={index}
         className={`transition-colors duration-1000 ${colour} border border-gray-800/20`}/>
        ))}
      </div>
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        <section className="text-center mb-16 mt-6">
          <h1 className="text-5xl font-bold mb-4">Discover Your LeetCode College Rank</h1>
          <p className="text-xl mb-12">Compare your LeetCode performance with peers from your college</p>
          <div className="flex justify-center space-x-4">
            <Input type="text" placeholder="Enter your college name" className="max-w-xs" />
            <Link href="/sign-in">
              <Button className='bg-neutral-600'>Get Ranking</Button>
            </Link>
          </div>
        </section>

        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Features:</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <Trophy className="w-12 h-12 mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">College Leaderboard</h3>
              <p>See how you stack up against other students from your college</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <Users className="w-12 h-12 mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Peer Comparison</h3>
              <p>Compare your progress with friends and classmates</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <Zap className="w-12 h-12 mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Performance Insights</h3>
              <p>Get detailed insights into your LeetCode performance</p>
            </div>
          </div>
        </section>

        <section id="contact" className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-300">Get in Touch</h2>
          <p className="mb-4">Have questions or feedback? We&apos;d love to hear from you!</p>
          <Link href="https://x.com/Himanshuu3112">
            <Button className='hover:bg-red-200'>Contact Us</Button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-center py-6 relative z-10">
        <p>&copy; {new Date().getFullYear()} LeetRank. All rights reserved.</p>
      </footer>
    </div>
  )
}

