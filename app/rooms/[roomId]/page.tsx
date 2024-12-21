import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { RoomLeaderboard } from "@/app/component/RoomLeaderboard";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, Trophy, Info } from "lucide-react";
import AddNewUserToRoom from "@/app/component/AddNewUserToRoomButton";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const room = await prisma.customRoom.findUnique({
    where: { id: params.roomId },
    include: {
      members: {
        include: {
          user: {
            include: {
              Ranking: true,
            },
          },
        },
      },
      creator: true,
    },
  });

  if (!room) {
    redirect("/rooms");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <header className="space-y-4 flex justify-between">
          <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold tracking-tight">{room.name}</h1>
          </div>
          {room.description && (
            <p className="text-gray-400 text-lg">{room.description}</p>
          )}
          </div>
          <AddNewUserToRoom roomId={room.id} />
        </header>

        {/* Leaderboard Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl text-white font-semibold">Leaderboard</h2>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RoomLeaderboard members={room.members} />
          </CardContent>
          <AddNewUserToRoom roomId={room.id} />
        </Card>

        {/* Room Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl text-slate-200 font-semibold">Room Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white">Created by</p>
                <p className="text-white font-semibold">{room.creator?.username || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-white">Created on</p>
                <p className="font-medium text-white">
                  {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}