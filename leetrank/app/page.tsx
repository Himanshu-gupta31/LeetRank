"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Users, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function Home() {
  const router=useRouter()
  const {isSignedIn}=useUser()
  useEffect(()=>{
     if(isSignedIn){
      router.push("/home")
     }
  },[isSignedIn])
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Discover Your LeetCode College Rank</h1>
          <p className="text-xl mb-8">Compare your LeetCode performance with peers from your college</p>
          <div className="flex justify-center space-x-4">
            <Input type="text" placeholder="Enter your college name" className="max-w-xs" />
            <Link href={"/sign-in"}>
            <Button className='bg-neutral-600'>Get Ranking</Button>
            </Link>
          </div>
        </section>

        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
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

        <section id="how-it-works" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <ol className="list-decimal list-inside space-y-4">
            <li>Enter your college name</li>
            <li>Connect your LeetCode account</li>
            <li>View your ranking and compare with peers</li>
            <li>Track your progress over time</li>
          </ol>
        </section>

        <section id="contact" className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-300">Get in Touch</h2>
          <p className="mb-4 ">Have questions or feedback? We'd love to hear from you!</p>
          <Link href={"https://x.com/Himanshuu3112"}>
          <Button className='hover:bg-neutral-600 '>Contact Us</Button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-center py-6">
        <p>&copy; {new Date().getFullYear()} LeetRank. All rights reserved.</p>
      </footer>
    </div>
  )
}