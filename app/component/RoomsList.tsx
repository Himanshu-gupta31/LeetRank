"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  description?: string;
  members: Array<{
    user: {
      username: string;
    };
  }>;
}

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.length > 0 &&
        rooms.map((room) => (
          <Card key={room.id} onClick={() => router.push(`/rooms/${room.id}`)} className="bg-indigo-800 hover:shadow-md hover:shadow-white">
            <CardHeader>
              <CardTitle className="text-white text-xl font-semibold">{room.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white mb-4">
                {room.description || "No description"}
              </p>
              <p className="text-sm text-white">
                {room.members.length} member
                {room.members.length === 1 ? "" : "s"}
              </p>
              <Button asChild className="mt-4">
                <Link href={`/rooms/${room.id}`}>View Room</Link>
              </Button>
            </CardContent>
          </Card>
        )
    )
        }
    </div>
  );
}
