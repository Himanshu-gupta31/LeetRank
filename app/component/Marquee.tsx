import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const ReviewCard = ({
    name,
    area,
    state,
    country,
    slug
}: {
  name: string;
  area: string;
  state: string;
  country: string;
  slug : string;
}) => {

  return (
    <figure
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
            <Link href={`/leaderboard/${slug}`} target="_blank">
          <figcaption className="text-xl font-semibold dark:text-white">
            {name}
          </figcaption>
          <p>{area},{state},{country}</p>
            </Link>
        </div>
      </div>
    </figure>
  );
};

export function MarqueeDemo() {

    const [colleges,setColleges]=useState([])
    
    const fetchColleges = async () => {
        try {
            const res = await fetch("api/college")
            const data = await res.json()
            setColleges(data)
        } catch (error) {
            console.log("Error fetching the colleges")
            setColleges([])
        }   
    }

    useEffect(() => {
        fetchColleges()
    },[])

  return (
    <div className="relative flex h-[250px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:110s]">
        {colleges.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-neutral-700 dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-neutral-700 dark:from-background"></div>
    </div>
  );
}
