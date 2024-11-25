import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

interface College {
  id: string;
  name: string;
  area: string;
  state: string;
  country: string;
}

interface EditCollegeModalProps {
  username: string;
  currentCollege: College;
  onUpdate: () => void;
}

export default function EditCollegeModal({ username, currentCollege, onUpdate }: EditCollegeModalProps) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isCollegesLoading, setIsCollegesLoading] = useState(true);
  const [showCollegeList, setShowCollegeList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchColleges();
    }
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowCollegeList(value.length > 0);
    setError(null);
  };

  const handleCollegeSelect = (college: College) => {
    setSelectedCollege(college);
    setSearchValue(college.name);
    setShowCollegeList(false);
    setError(null);
  };

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

      if (data.success) {
        setIsOpen(false);
        onUpdate();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
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

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-white hover:bg-black hover:text-white" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Update College</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for your college..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full bg-gray-800 border-gray-700 text-white"
            />
            {showCollegeList && !isCollegesLoading && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md max-h-60 overflow-auto">
                {filteredColleges.map((college) => (
                  <div
                    key={college.id}
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleCollegeSelect(college)}
                  >
                    <p className="text-sm font-medium">{college.name}</p>
                    <p className="text-xs text-gray-400">
                      {college.area}, {college.state}, {college.country}
                    </p>
                  </div>
                ))}
                {filteredColleges.length === 0 && (
                  <div className="p-2 text-gray-400">No colleges found</div>
                )}
              </div>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={isFormSubmitted || !selectedCollege}
          >
            {isFormSubmitted ? "Updating..." : "Update College"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}