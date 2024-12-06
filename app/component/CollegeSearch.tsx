"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'

interface College {
  id: string
  name: string
  area: string
  state: string
  country: string
  slug: string
}

export function CollegeSearch() {
  const [colleges, setColleges] = useState<College[]>([])
  const [searchValue, setSearchValue] = useState("")
  const [isCollegesLoading, setIsCollegesLoading] = useState(true)
  const [showCollegeList, setShowCollegeList] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/college")
        const data = await res.json()
        setColleges(data)
        setIsCollegesLoading(false)
      } catch (error) {
        console.error("Error fetching the colleges:", error)
        setColleges([])
        setIsCollegesLoading(false)
      }
    }

    fetchColleges()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowCollegeList(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredColleges = searchValue
    ? colleges.filter((college) =>
        college.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : colleges

  return (
    <Card className="bg-neutral-900 border-none mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          Check Leaderboard for Other Colleges/Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2" id="college-search-container">
          <Label htmlFor="college" className="text-gray-200">College</Label>
          <div className="relative">
            <Input
              type="text"
              id="college"
              ref={inputRef}
              placeholder="Search for a college..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
                setShowCollegeList(true)
              }}
              onFocus={() => setShowCollegeList(true)}
              className="bg-neutral-800 text-white border-gray-700"
              aria-expanded={showCollegeList}
              aria-haspopup="listbox"
              aria-controls="college-list"
            />
            {showCollegeList && (
              <div 
                ref={dropdownRef}
                id="college-list"
                role="listbox"
                className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-neutral-800 rounded-md shadow-lg border border-gray-700"
              >
                {isCollegesLoading ? (
                  <div className="p-2 text-center text-gray-300">
                    <Loader2 className="animate-spin inline-block" />
                    <span className="ml-2">Loading colleges...</span>
                  </div>
                ) : filteredColleges.length === 0 ? (
                  <div className="p-2 text-center text-gray-400">
                    No colleges found
                  </div>
                ) : (
                  filteredColleges.map((college) => (
                    <div
                      key={college.id}
                      role="option"
                      aria-selected={false}
                      className="p-2 hover:bg-neutral-700 cursor-pointer text-gray-200"
                      onClick={() => {
                        router.push(`/leaderboard/${college.slug}`)
                        setShowCollegeList(false)
                      }}
                    >
                      {college.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

