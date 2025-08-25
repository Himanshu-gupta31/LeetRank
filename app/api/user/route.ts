import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  
  if (!clerkId) {
    return NextResponse.json({ error: "Missing ClerkId" }, { status: 400 });
  }

  try {
    // First check if user exists by clerkId
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

      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        return NextResponse.json({ error: "Email address required" }, { status: 400 });
      }

      // Check if user with this email already exists
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email: email }
      });

      // Check if user with this clerkId already exists (shouldn't happen but safety check)
      const existingUserWithClerkId = await prisma.user.findUnique({
        where: { clerkId: clerkId }
      });

      if (existingUserWithEmail) {
        // If email exists, update that user with the new clerkId
        // But first check if the clerkId is already taken by another user
        if (existingUserWithClerkId && existingUserWithClerkId.id !== existingUserWithEmail.id) {
          // Another user already has this clerkId, we need to handle this conflict
          // For now, we'll return an error asking user to contact support
          return NextResponse.json({ 
            error: "Account conflict detected. Please contact support." 
          }, { status: 409 });
        }

        try {
          user = await prisma.user.update({
            where: { email: email },
            data: { 
              clerkId: clerkId,
              clerkusername: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous User'
            },
            select: {
              clerkusername: true,
              username: true,
              college: true,
            }
          });
        } catch (updateError) {
          console.error("Error updating user:", updateError);
          return NextResponse.json({ 
            error: "Failed to update user account" 
          }, { status: 500 });
        }
      } else if (existingUserWithClerkId) {
        // If clerkId exists but email doesn't, this is an unusual case
        // Update the existing user with the new email
        try {
          user = await prisma.user.update({
            where: { clerkId: clerkId },
            data: { 
              email: email,
              clerkusername: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous User'
            },
            select: {
              clerkusername: true,
              username: true,
              college: true,
            }
          });
        } catch (updateError) {
          console.error("Error updating user:", updateError);
          return NextResponse.json({ 
            error: "Failed to update user account" 
          }, { status: 500 });
        }
      } else {
        // Create new user since no conflicts exist
        try {
          user = await prisma.user.create({
            data: {
              clerkId: clerkId,
              clerkusername: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous User',
              email: email,
            },
            select: {
              clerkusername: true,
              username: true,
              college: true,
            }
          });
        } catch (createError: any) {
          console.error("Error creating user:", createError);
          
          // Handle specific Prisma errors
          if (createError.code === 'P2002') {
            // Unique constraint violation
            const field = createError.meta?.target?.[0];
            if (field === 'clerkId') {
              return NextResponse.json({ 
                error: "User ID already exists. Please try signing in again." 
              }, { status: 409 });
            } else if (field === 'email') {
              return NextResponse.json({ 
                error: "Email already registered. Please sign in with existing account." 
              }, { status: 409 });
            }
          }
          
          return NextResponse.json({ 
            error: "Failed to create user account. Please try again." 
          }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching/creating the user", error);
    return NextResponse.json(
      { error: "Please sign up again" },
      { status: 500 }
    );
  }
}