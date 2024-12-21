import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId : clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: "User is not authenticated",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
        where : {
            clerkId : clerkUserId
        }
    })

    if (!user) {
        return NextResponse.json(
            {
              error: "User not found in database",
            },
            { status: 404 }
          );
    }

    const { name, description } = await req.json();
    const roomExists = await prisma.customRoom.findFirst({
      where: {
        name: name,
      },
    });
    if (roomExists) {
      return NextResponse.json(
        {
          message: "This room already exists!",
        },
        { status: 500 }
      );
    }

    const room = await prisma.customRoom.create({
      data: {
        name,
        description,
        slug: name.toLowerCase().replace(/ /g, "-"),
        creator: {
          connect: {
            id: user.id,
          },
        },
        members: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      room,
      message: "Room created",
    });
  } catch (error) {
    console.error("unable to create the room", error);
    return NextResponse.json(
      {
        error: "Unable to create the room",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId : clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      return NextResponse.json(
        {
          error: "User is not authenticated",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
        where : {
            clerkId : clerkUserId
        }
    })

    if (!user) {
        return NextResponse.json(
          {
            error: "User not found in database",
          },
          { status: 404 }
        );
      }

    // using this we can get the information about the user's room
    const rooms = await prisma.customRoom.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      // give the result including the members of the room
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      rooms,
      message: "Rooms fetched",
    });
  } catch (error) {
    console.error("unable to fetch the rooms", error);
    return NextResponse.json(
      {
        error: "Unable to fetch the rooms",
      },
      {
        status: 500,
      }
    );
  }
}
