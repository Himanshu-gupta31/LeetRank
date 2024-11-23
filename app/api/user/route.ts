import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  
  if (!clerkId) {
    return NextResponse.json({ error: "Missing ClerkId" }, { status: 400 });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkId as string },
      select: {
        clerkusername: true,
        username: true,
        college: true,
      }
    });

    if (!user) {
      // Get the current user's details from Clerk
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      user = await prisma.user.create({
        data: {
          clerkId: clerkId,
          clerkusername: `${clerkUser.firstName} ${clerkUser.lastName}`,
          email: clerkUser.emailAddresses[0]?.emailAddress,
        },
        select: {
          clerkusername: true,
          username: true,
          college: true,
        }
      });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching/creating the user", error);
    return NextResponse.json(
      { error: "Internal server error has occurred." },
      { status: 500 }
    );
  }
}