'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateRoom } from "../component/CreateRoom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { RoomList } from "../component/RoomsList";

export default function RoomsPage() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isClerkLoaded && user?.id) {
      getRooms();
    } else if (isClerkLoaded && !user) {
      router.push("/auth/sign-in");
    }
  }, [isClerkLoaded, user]);

  const getRooms = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/rooms");
      const response = await res.json();
      setRooms(response);
      console.log(response);
    } catch (error) {
      console.error("unable to fetch the rooms for the user");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Custom Rooms</h1>
          <p className="text-gray-400">Create or join rooms to compare your leetcode journey with others!</p>
        </header>

        {rooms.length === 0 ? (
          <div className="space-y-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-center space-x-4">
                  <Info className="w-8 h-8 text-blue-500" />
                  <h2 className="text-xl font-semibold">No Custom Rooms Found</h2>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400">
                  Get started by creating your first room using the form below.
                </p>
              </CardContent>
            </Card>

            <div className="transition-all hover:scale-[1.01]">
              <CreateRoom />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <RoomList />            
            <div className="pt-8 border-t border-gray-800">
              <CreateRoom />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}