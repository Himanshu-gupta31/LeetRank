"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MarqueeDemo } from "./component/Marquee";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const bgColour = [
    "bg-neutral-800",
    "bg-neutral-900",
    "bg-zinc-900",
    "bg-zinc-800",
    "bg-gray-800",
    "bg-stone-900",
    "bg-stone-800",
    
  ];
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [grid, setGrid] = useState(Array(64).fill("bg-transparent"));

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGrid((prevcolour) => {
        return prevcolour.map(() =>
          Math.random() > 0.7
            ? bgColour[Math.floor(Math.random() * bgColour.length)]
            : "bg-transparent"
        );
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 z-0">
        {grid.map((colour, index) => (
          <div
            key={index}
            className={`transition-colors duration-1000 ${colour} border border-gray-800/20`}
          />
        ))}
      </div>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <section className="text-center mb-16 mt-6">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-b from-neutral-700 to-neutral-300 text-transparent bg-clip-text">
            Discover Your LeetCode College Rank
          </h1>
          <p className="text-3xl mb-12 text-white">
            Compare your LeetCode performance with peers from your college
          </p>
          <Badge className="text-2xl font-semibold mb-8 bg-black">
            Click on any college to check out their leaderboard!
          </Badge>
          <div>
            <MarqueeDemo />
          </div>
        </section>

        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Features:</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 ">
              <div className="bg-gray-800 p-[4rem] rounded-2xl">
                <Trophy className="w-12 h-12 mb-4 text-yellow-400" />
                <h3 className="text-xl font-semibold mb-2">
                  College Leaderboard
                </h3>
                <p>
                  See how you stack up against other students from your college
                </p>
              </div>
            </div>
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-green-400 via-teal-500 to-blue-500">
              <div className="bg-gray-800 p-[4rem] rounded-2xl">
                <Users className="w-12 h-12 mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2">Peer Comparison</h3>
                <p>Compare your progress with friends and classmates</p>
              </div>
            </div>
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 ">
              <div className="bg-gray-800 p-[4rem] rounded-2xl">
                <Zap className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-xl font-semibold mb-2">
                  Performance Insights
                </h3>
                <p>Get detailed insights into your LeetCode performance</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-300">
            Get in Touch
          </h2>
          <p className="mb-4">
            Have questions or feedback? We&apos;d love to hear from you!
          </p>
          <Link href="https://x.com/Himanshuu3112">
            <Button className="hover:bg-red-200">Contact Us</Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
