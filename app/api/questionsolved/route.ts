import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 400 }
      );
    }

    const username = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        username: true,
      },
    });

    if (!username) {
      return NextResponse.json({
        success: false,
        message: "No leetcode username available for the user.",
      });
    }
    const leetcodeUrl = `https://alfa-leetcode-api.onrender.com/${username}/solved`;
    const leetcodeResponse = await fetch(leetcodeUrl);
    const profileData = await leetcodeResponse.json();
    return NextResponse.json({ success: true, profileData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching LeetCode profile:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching LeetCode profile" },
      { status: 500 }
    );
  }
}
