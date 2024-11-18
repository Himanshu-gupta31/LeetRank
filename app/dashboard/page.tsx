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
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface College {
  id: string
  name: string
  area: string
  state: string
  country: string
}

export default function Dashboard() {
  const { user } = useUser()
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)
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
          college: selectedCollege?.name || college,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        console.log("Correctly updated college and lcusername", data.data)
        router.push(
          `/profile?username=${data.username}&college=${data.college}`
        )
      }
      if (data.success) {
        console.log("Details successfully registered:", data)
        router.push(`/profile?username=${username}&college=${selectedCollege?.name || college}`)
      } else {
        console.error("Failed to register details:", data.message)
        setIsFormSubmitted(false)
      }
    } catch (error) {
      console.error("An error occurred:", error)
      setIsFormSubmitted(false)
    }
  }

  const fetchColleges = async () => {
    try {
      const response = await fetch("/api/college")
      const data = await response.json()
      setColleges(data)
    } catch (error) {
      console.error("Unable to fetch colleges", error)
    }
  }

  useEffect(() => {
    fetchColleges()
  }, [])

  useEffect(() => {
    async function fetchOrCreateUser() {
      if (user) {
        try {
          const createRes = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              clerkusername: user.username || user.firstName || "User",
            }),
          })
          if (createRes.ok) {
            const upsertedUser = await createRes.json()
            setDbUser(upsertedUser)
            setUsername(upsertedUser.username || "")
            setCollege(upsertedUser.college || "")
            if (upsertedUser.username && upsertedUser.college) {
              setIsFormSubmitted(true)
            }
          } else {
            console.error("Failed to upsert user!")
          }
        } catch (error) {
          console.error("Error upserting user!", error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchOrCreateUser()
  }, [user, router])

  if (loading || !user || !dbUser) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 color="white" className="animate-spin" />
      </div>
    )
  }

  function RedirectIfUsernameAndCollege() {
    useEffect(() => {
      if (dbUser.username && dbUser.college) {
        router.push(`/profile?username=${username}&college=${college}`)
      }
    }, [])
    return null
  }

  return (
    <div className="flex flex-col space-y-2 justify-center items-center bg-gradient-to-br from-gray-900 to-black p-4 min-h-screen">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Welcome, {dbUser.clerkusername}!</CardTitle>
          <CardDescription>Email: {dbUser.email}</CardDescription>
          <CardDescription>Clerk ID: {user.id}</CardDescription>
          <CardDescription>LC username: {dbUser.username}</CardDescription>
          <CardDescription>
            College: {dbUser.college === "default" ? "Not set" : dbUser.college}
          </CardDescription>
        </CardHeader>
      </Card>
      <RedirectIfUsernameAndCollege />
      {!isFormSubmitted && (
        <Card className="w-full max-w-5xl">
          <CardHeader className="">
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
                {/* // have to create a POST request for this one */}
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