"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

interface College {
  id: string;
  name: string;
  area: string;
  state: string;
  country: string;
}

interface DbUser {
  clerkusername: string;
  username: string | null;
  college: string | null;
}

interface CollegeInput {
  collegeName: string;
  area: string;
  state: string;
  country: string;
}

export default function Dashboard() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isCollegesLoading, setIsCollegesLoading] = useState(true);
  const [showCollegeList, setShowCollegeList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollege) {
      setError("Please select a college");
      return;
    }
    setIsFormSubmitted(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          collegeId: selectedCollege.id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      if (response.ok) {
        router.push(`/profile`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsFormSubmitted(false);
    }
  };

  const fetchColleges = async () => {
    setIsCollegesLoading(true);
    try {
      const response = await fetch("/api/college");
      if (!response.ok) {
        throw new Error("Failed to fetch colleges");
      }
      const data = await response.json();
      setColleges(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Unable to fetch colleges", error);
      setError("Failed to load colleges");
      setColleges([]);
    } finally {
      setIsCollegesLoading(false);
    }
  };

  const fetchUser = async (clerkId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user?clerkId=${clerkId}`);
      if (!response.ok) {
        throw new Error("Please sign up again");
      }
      const data = await response.json();
      setDbUser(data.user);
    } catch (error) {
      console.error("Unable to fetch user details:", error);
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = searchValue
    ? colleges.filter((college) =>
        college.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : colleges;

  useEffect(() => {
    if (isClerkLoaded && user?.id) {
      fetchUser(user.id);
      fetchColleges();
    } else if (isClerkLoaded && !user) {
      setLoading(false);
      setError("Please sign in to continue");
    }
  }, [isClerkLoaded, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#college-search-container")) {
        setShowCollegeList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function AddCollegeModal() {
    const [inputCollege, setInputCollege] = useState<CollegeInput>({
      collegeName: '',
      area: '',
      state: '',
      country: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputCollege(prev => ({
        ...prev,
        [name]: value
      }));
    };
    const [loading,setLoading] = useState(false)

    const handleAddCollege = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true)
      try {
        const res = await fetch('/api/addCollege', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(inputCollege)
        });
    
        if (res.ok) {
          setIsModalOpen(false);
          const newCollege = await res.json(); // Get the newly added college data
          
          setInputCollege({
            collegeName: '',
            area: '',
            state: '',
            country: ''
          });
          
          await fetchColleges();
          
          // Clear search value to show all colleges including the new one
          setSearchValue('');
          
          // Optionally, auto-select the newly added college
          if (newCollege && newCollege.id) {
            setSelectedCollege(newCollege);
            setSearchValue(newCollege.collegeName);
          }
        } else {
          const errorData = await res.json();
          console.error("Unable to add College", errorData);
        }
      } catch (error) {
        console.error("Error in adding college:", error);
      } finally {
        setLoading(false)
      }
    };

    return (
      <Dialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      >
        <DialogContent>
          <form onSubmit={handleAddCollege}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="collegeName">College Name/Community:</Label>
                <Input 
                  id="collegeName"
                  name="collegeName"
                  value={inputCollege.collegeName} 
                  onChange={handleInputChange} 
                  placeholder="Enter your college name" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="area">Area:</Label>
                <Input 
                  id="area"
                  name="area"
                  value={inputCollege.area}
                  onChange={handleInputChange} 
                  placeholder="Enter the area your college is located in" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="state">State:</Label>
                <Input 
                  id="state"
                  name="state"
                  value={inputCollege.state}
                  onChange={handleInputChange} 
                  placeholder="Enter the state your college is located in" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="country">Country:</Label>
                <Input 
                  id="country"
                  name="country"
                  value={inputCollege.country}
                  onChange={handleInputChange} 
                  placeholder="Enter the country your college is located in" 
                  required 
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">{loading ? "Adding College..." : "Add College"}</Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isClerkLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full bg-black max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (dbUser?.username && dbUser?.college) {
    router.push(`/profile`);
    return null;
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
              <div className="space-y-2" id="college-search-container">
                <Label htmlFor="college">College</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for your college..."
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setShowCollegeList(true);
                    }}
                    onFocus={() => setShowCollegeList(true)}
                  />
                  {showCollegeList && (
                    <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-neutral-800 text-white rounded-md shadow-lg border border-gray-700">
                      {isCollegesLoading ? (
                        <div className="p-2 text-center">
                          <Loader2 className="animate-spin inline-block" />
                          <span className="ml-2">Loading colleges...</span>
                        </div>
                      ) : filteredColleges.length === 0 ? (
                        <div className="p-2 text-center text-gray-500">
                          No colleges found
                        </div>
                      ) : (
                        filteredColleges.map((college) => (
                          <div
                            key={college.id}
                            className="p-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => {
                              setSelectedCollege(college);
                              setSearchValue(college.name);
                              setShowCollegeList(false);
                            }}
                          >
                            {college.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {selectedCollege && (
                  <p className="text-sm text-green-500 mt-1">
                    Selected: {selectedCollege.name}
                  </p>
                )}
              </div>
              <div className="flex space-x-4 justify-start items-center">
                <p>Can't find your college?</p>
                <Button type="button" onClick={() => setIsModalOpen(true)}>Add your college!</Button>
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
      <AddCollegeModal />
    </div>
  );
}

