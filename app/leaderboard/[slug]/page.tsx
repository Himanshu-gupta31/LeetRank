"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CollegeSearch } from "@/app/component/CollegeSearch"

interface LeaderboardData {
  totalUsers: number
  leaderboard: {
    rank: number
    username: string
    score: number
  }[]
  collegeName: string
}

interface LeaderboardPageProps {
    params : {
        slug : string
    }
}

export default function Leaderboard({params} : LeaderboardPageProps) {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  // have to get the collegeId from the params
  const slug = params.slug
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/collegeLeaderboard?slug=${slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data")
        }
        const leaderboardData: LeaderboardData = await response.json()
        setData(leaderboardData)
      } catch (err) {
        setError("An error occurred while fetching the leaderboard.")
        console.error(err)
      }
    }

    fetchLeaderboard()
  }, [])

  if (error) {
    return <div className="text-center text-red-500 font-semibold mt-8">{error}</div>
  }

  return (
    <div className="mx-auto px-12 py-8 min-h-screen bg-black ">
      <Card className="bg-neutral-900 border-none mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {data ? (
            <>
              <p className="text-gray-200 mb-2">College: {data.collegeName}</p>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">Total Users: {data.totalUsers}</Badge>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-3/4 bg-gray-700 mb-2" />
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-24 bg-gray-700" />
                <Skeleton className="h-6 w-24 bg-gray-700" />
              </div>
            </>
          )}
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">Rank</TableHead>
                <TableHead className="text-gray-400">Username</TableHead>
                <TableHead className="text-gray-400 text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data ? (
                data.leaderboard.map((user) => (
                  <TableRow key={user.username} className="border-b border-gray-800 bg-gray-900 hover:bg-gray-600">
                    <TableCell className="font-medium text-white">{user.rank}</TableCell>
                    <TableCell className="text-gray-300">{user.username}</TableCell>
                    <TableCell className="text-right text-gray-300">{user.score}</TableCell>
                  </TableRow>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-gray-800">
                    <TableCell><Skeleton className="h-4 w-8 bg-gray-700" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 bg-gray-700" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 bg-gray-700 ml-auto" /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CollegeSearch />
    </div>
  )
}

