"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LeetCodeProfile() {
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          college,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Details successfully registered:", data);
        router.push(`/profile/${username}`); // Redirect to the user's profile page
      } else {
        console.error("Failed to register details:", data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">LeetCode Profile</CardTitle>
          <CardDescription className="text-center">Enter your details to create your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">LeetCode Username</Label>
            <Input
              id="username"
              placeholder="Enter your LeetCode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college">College</Label>
            <Input
              id="college"
              placeholder="Enter your college name"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            Generate Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
