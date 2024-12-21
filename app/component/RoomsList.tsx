"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
          <Card key={room.id} className="">
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {room.description || "No description"}
              </p>
              <p className="text-sm">
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