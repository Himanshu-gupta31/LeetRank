"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProfileData {
  userProfile: {
    matchedUser: {
      username: string
      githubUrl: string | null
      twitterUrl: string | null
      linkedinUrl: string | null
      contributions: {
        points: number
        questionCount: number
        testcaseCount: number
      }
      profile: {
        realName: string | null
        userAvatar: string | null
        birthday: string | null
        ranking: number
        reputation: number
        websites: string[]
        countryName: string | null
        company: string | null
        school: string | null
        skillTags: string[]
        aboutMe: string | null
        starRating: number
      }
      submitStats: {
        acSubmissionNum: {
          difficulty: string
          count: number
          submissions: number
        }[]
      }
    }
  }
  languageStats: {
    matchedUser: {
      languageProblemCount: {
        languageName: string
        problemsSolved: number
      }[]
    }
  }
  collegeData: {
    id: string
    name: string
    area: string
    state: string
    country: string
  }
  username: string
}

export default function Component() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState("")
  const [rank, setRank] = useState<string | null>("2")

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/leetcodedata")
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      setError("An error occurred while fetching the profile details.")
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  if (error) {
    return <div className="text-center text-red-400 font-semibold mt-8">{error}</div>
  }

  const questionData = profile?.userProfile.matchedUser.submitStats.acSubmissionNum.reduce((acc, curr) => {
    acc[curr.difficulty.toLowerCase()] = curr.count
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              {profile ? (
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.userProfile.matchedUser.profile.userAvatar || ''} alt={profile.userProfile.matchedUser.profile.realName || ''} />
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">{profile.userProfile.matchedUser.profile.realName}</h2>
                    <p className="text-gray-400">@{profile.userProfile.matchedUser.username}</p>
                    <Badge className="mt-2 bg-gray-700 text-gray-200">Global Rank: {profile.userProfile.matchedUser.profile.ranking}</Badge>
                    <p className="text-sm text-gray-400 mt-2">{profile.userProfile.matchedUser.profile.countryName}</p>
                  </div>
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

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6 h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <Trophy className="text-yellow-400 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">College Rank</h2>
                {rank !== null ? (
                  <p className="text-yellow-400 font-bold text-4xl">{rank}</p>
                ) : (
                  <Skeleton className="h-10 w-16 bg-gray-700" />
                )}
                <Link href={"/leaderboard"}>
                <Button className="my-2 px-4 bg-white hover:bg-black hover:text-white text-gray-800 font-semibold">Leaderboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {questionData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Total Solved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">{questionData.all}</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-700 border-blue-600">
              <CardHeader>
                <CardTitle className="text-blue-200">Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-200">{questionData.easy}</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-700 border-orange-600">
              <CardHeader>
                <CardTitle className="text-orange-200">Medium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-200">{questionData.medium}</p>
              </CardContent>
            </Card>
            <Card className="bg-red-700 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-200">Hard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-200">{questionData.hard}</p>
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
      </div>
    </div>
  )
}

