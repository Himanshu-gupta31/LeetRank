import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const userProfileQuery = `#graphql
query getUserProfile($username: String!) {
    matchedUser(username: $username) {
        username
        githubUrl
        twitterUrl
        linkedinUrl
        contributions {
            points
            questionCount
            testcaseCount
        }
        profile {
            realName
            userAvatar
            birthday
            ranking
            reputation
            websites
            countryName
            company
            school
            skillTags
            aboutMe
            starRating
        }
        submitStats {
            totalSubmissionNum {
                difficulty
                count
                submissions
            }
            acSubmissionNum {
                difficulty
                count
                submissions
            }
        }
        submissionCalendar
    }
}`;

const languageStatsQuery = `#graphql
query languageStats($username: String!) {
    matchedUser(username: $username) {
        languageProblemCount {
            languageName
            problemsSolved
        }
    }
}`;

function calculateScore(submitStats: any) {
  const weights = { Easy: 1, Medium: 3, Hard: 5 };
  return submitStats.acSubmissionNum.reduce((score: number, stat: any) => {
    return (
      score +
      stat.count * (weights[stat.difficulty as keyof typeof weights] || 0)
    );
  }, 0);
}

async function fetchLeetCodeData(username: string, query: string) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({
      query: query,
      variables: {
        username: username,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json(
      {
        message: "User is not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { compareUsername } = body;

    if (!compareUsername) {
      return NextResponse.json(
        {
          message: "Please provide a username to compare with!",
        },
        { status: 400 }
      );
    }

    const userProfile = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        college: true,
        username: true,
      },
    });

    if (!userProfile || !userProfile.username) {
      return NextResponse.json(
        {
          message: "User profile not found or LeetCode username not set",
        },
        { status: 404 }
      );
    }

    const comparedUserProfile = await prisma.user.findFirst({
      where: {
        username: compareUsername,
      },
    });

    if (!comparedUserProfile) {
      return NextResponse.json(
        {
          message: `${compareUsername} is not on Leet-Rank, please invite that user to Leetrank to enable comparison!`,
        },
        { status: 410 }
      );
    }

    const [user1ProfileData, user1LanguageData, user2ProfileData, user2LanguageData] = await Promise.all([
      fetchLeetCodeData(userProfile.username, userProfileQuery),
      fetchLeetCodeData(userProfile.username, languageStatsQuery),
      fetchLeetCodeData(compareUsername, userProfileQuery),
      fetchLeetCodeData(compareUsername, languageStatsQuery),
    ]);

    const leetcodeScore1 = calculateScore(user1ProfileData.data.matchedUser.submitStats);
    const leetcodeScore2 = calculateScore(user2ProfileData.data.matchedUser.submitStats);

    return NextResponse.json({
      user1: {
        userProfile: user1ProfileData.data || null,
        languageStats: user1LanguageData.data || null,
        collegeData: userProfile.college || "Not available",
        username: userProfile.username,
        leetcodeScore: leetcodeScore1,
      },
      user2: {
        userProfile: user2ProfileData.data || null,
        languageStats: user2LanguageData.data || null,
        username: compareUsername,
        leetcodeScore: leetcodeScore2,
      },
    });
  } catch (error) {
    console.error("Error comparing users:", error);
    return NextResponse.json(
      { message: "Failed to compare users" },
      { status: 500 }
    );
  }
}

