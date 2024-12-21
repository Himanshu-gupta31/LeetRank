import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        {
          error: "User is not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const { username } = await req.json();
  
    // find the user by username
    const userToAdd = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!userToAdd) {
      return NextResponse.json({
        error: "User not found,please check the username.",
      },{
        status : 400
      });
    }

    // if all is correct then add the user to the room
    const addUserToRoom = await prisma.roomMember.create({
      data: {
        userId: userToAdd.id,
        roomId: params.roomId,
      },
    });

    return NextResponse.json(
      { addUserToRoom, message: "user added" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error adding user to room:", error);
    return NextResponse.json(
      { success: false, error: "Error adding user" },
      { status: 500 }
    );
  }
}
