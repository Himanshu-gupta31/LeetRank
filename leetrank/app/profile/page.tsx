"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface ProfileData {
  avatar: string
  username: string
  name: string
  ranking: number
  country: string
}

interface QuestionData {
  solvedProblem: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
}

export default function Component({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const username = searchParams.username
  const college=searchParams.college
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [error, setError] = useState("")
  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [rank,setRank]=useState("")
  useEffect(() => {
    if (username && college) {
      fetchProfileData(username,college)
      fetchQuestionsSolved(username,college)
      fetchRank(username,college)
      
    }
  }, [username])

  const fetchProfileData = async (username: string , college:string) => {
    try {
      const response = await fetch(`/api/fetchuserdetails?username=${username}&college=${college}`)
      const data = await response.json()
      if (data.success) {
        setProfileData(data.profileData)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("An error occurred while fetching the profile details.")
      console.error(error)
    }
  }

  const fetchQuestionsSolved = async (username: string,college:string) => {
    try {
      const response = await fetch(`/api/questionsolved?username=${username}&college=${college}`)
      const data = await response.json()
      if (data.success) {
        setQuestionData(data.profileData)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("An error occurred while fetching the questions solved data.")
      console.error(error)
    }
  }
  const fetchRank=async(username:string,college:string)=>{
    try {
      const response=await fetch(`api/rankingsystem?username=${username}&college=${college}`);
      const data=await response.json()
      if(data.success){
       setRank(data.userRank)
      }
      else{
        setError(data.message)
      }
    } catch (error) {
      setError("An error occurred while fetching the college rank.")
      console.error(error)
    }
  }

  if (error) {
    return <div className="text-center text-red-400 font-semibold mt-8">{error}</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            {profileData ? (
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  
                </Avatar>
                <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
                <p className="text-gray-400">@{profileData.username}</p>
                <Badge  className="bg-gray-700 text-gray-200">Rank: {profileData.ranking}</Badge>
                <p className="text-sm text-gray-400">{profileData.country}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="w-24 h-24 rounded-full bg-gray-700" />
                <Skeleton className="h-6 w-32 bg-gray-700" />
                <Skeleton className="h-4 w-24 bg-gray-700" />
                <Skeleton className="h-5 w-16 bg-gray-700" />
                <Skeleton className="h-4 w-20 bg-gray-700" />
              </div>
            )}
          </CardContent>
        </Card>

        {questionData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-200">
              <CardHeader>
                <CardTitle className="text-white">Total Solved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{questionData.solvedProblem}</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-700 border-blue-300">
              <CardHeader>
                <CardTitle className="text-blue-200">Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-200">{questionData.easySolved}</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-700 border-orange-300">
              <CardHeader>
                <CardTitle className="text-orange-200">Medium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-200">{questionData.mediumSolved}</p>
              </CardContent>
            </Card>
            <Card className="bg-red-700 border-red-300">
              <CardHeader>
                <CardTitle className="text-red-200">Hard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-200">{questionData.hardSolved}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <Skeleton className="h-6 w-24 bg-gray-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-16 bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="text-4xl font-bold pt-6">
          College Ranking
         <div>{rank}</div>
        </div>

      </div>

    </div>
  )
}