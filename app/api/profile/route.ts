import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
export async function POST(request: NextRequest) {
  try {
    // changing this api to set the college and leetcode username for the user using their clerkId
    const { username, college } = await request.json();
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "User is not authneticated" },
        { status: 500 }
      );
    }

    const res = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        username: username,
        college: college,
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Error creating user" },
      { status: 500 }
    );
  }
}
