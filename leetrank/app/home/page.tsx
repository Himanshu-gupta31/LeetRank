'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LeetCodeProfile() {
    
    const [username,Setusername]=useState("")
    const [college,Setcollege]=useState("")
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4'>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">LeetCode Profile</CardTitle>
          <CardDescription className="text-center">Enter your details to create your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">LeetCode Username</Label>
            <Input id="username" placeholder="Enter your LeetCode username" 
            value={username}
            onChange={(e)=>Setusername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college">College</Label>
            <Input id="college" placeholder="Enter your college name" 
            value={college}
            onChange={(e)=>Setcollege(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Generate Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}