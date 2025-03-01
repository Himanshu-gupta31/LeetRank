import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  
  if (!clerkId) {
    return NextResponse.json({ error: "Missing ClerkId" }, { status: 400 });
  }

  try {
    // First check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkId as string },
      select: {
        clerkusername: true,
        username: true,
        college: true,
      }
    });

    // If no user found, get current authenticated user and create one
    if (!user) {
      // Explicitly check auth session first
      const { userId } = await auth();
      
      if (!userId) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: "Unable to fetch user details" }, { status: 401 });
      }

      // Add error handling for missing data
      if (!clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
        return NextResponse.json({ error: "Email address required" }, { status: 400 });
      }

      // Create the user with proper error handling
      try {
        user = await prisma.user.create({
          data: {
            clerkId: clerkId,
            clerkusername: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous User',
            email: clerkUser.emailAddresses[0]?.emailAddress,
          },
          select: {
            clerkusername: true,
            username: true,
            college: true,
          }
        });
      } catch (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.json({ error: "Failed to create user account" }, { status: 500 });
      }
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching/creating the user", error);
    return NextResponse.json(
      { error: "Please sign up again" }, // Return the actual error message
      { status: 500 }
    );
  }
}