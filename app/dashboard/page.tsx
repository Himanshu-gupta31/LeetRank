"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { GraduationCap, Loader2 } from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface College {
  id: string
  name: string
  area: string
  state: string
  country: string
}

interface DbUser {
  clerkusername: string
  username: string | null
  college: string | null
}

export default function Dashboard() {
  const { user, isLoaded: isClerkLoaded } = useUser()
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [college, setCollege] = useState("")
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [colleges, setColleges] = useState<College[]>([])
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFormSubmitted(true)
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          collegeId: selectedCollege?.id || college,
        }),
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      if (data.success) {
        router.push(`/profile?username=${username}&college=${selectedCollege?.name || college}`)
      }
    } catch (error) {
      console.error("An error occurred:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsFormSubmitted(false)
    }
  }

  const fetchColleges = async () => {
    try {
      const response = await fetch("/api/college")
      if (!response.ok) {
        throw new Error("Failed to fetch colleges")
      }
      const data = await response.json()
      setColleges(data)
    } catch (error) {
      console.error("Unable to fetch colleges", error)
      setError("Failed to load colleges")
    }
  }

  const fetchUser = async (clerkId: string) => {
    try {
      const response = await fetch(`/api/user?clerkId=${clerkId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch user details")
      }
      const data = await response.json()
      setDbUser(data.user)
    } catch (error) {
      console.error("Unable to fetch user details:", error)
      setError("Failed to load user details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isClerkLoaded && user?.id) {
      fetchUser(user.id)
      fetchColleges()
    } else if (isClerkLoaded && !user) {
      setLoading(false)
      setError("Please sign in to continue")
    }
  }, [isClerkLoaded, user])

  if (!isClerkLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (dbUser?.username && dbUser?.college) {
    router.push(`/profile`)
    return null
  }

  return (
    <div className="flex flex-col space-y-2 justify-center items-center bg-gradient-to-br from-gray-900 to-black p-4 min-h-screen">
      {!isFormSubmitted && (
        <Card className="w-full max-w-5xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              LeetCode Profile
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your profile
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">LeetCode Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your LeetCode username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between">
                      {selectedCollege ? selectedCollege.name : "Select a college"} <GraduationCap />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
                    {colleges.map((college) => (
                      <DropdownMenuItem
                        key={college.id}
                        onSelect={() => setSelectedCollege(college)}
                      >
                        {college.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {!selectedCollege && (
                  <Input
                    id="college"
                    placeholder="Or enter your college name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                Generate Report
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}