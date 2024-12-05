import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const userProfileQuery = `#graphql
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
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

async function fetchLeetCodeData(username: string) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({
      query: userProfileQuery,
      variables: { username: username },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { message: "Please provive the collegeId" },
      { status: 400 }
    );
  }

  try {
    const college = await prisma.college.findUnique({
      where: {
        slug : slug,
      },
      select : {
        id : true,
        name : true
      }
    });

    if (!college) {
      return NextResponse.json(
        {
          message:
            "Invalid College Id, Please try again with correct college Id",
        },
        {
          status: 500,
        }
      );
    }

    const allUsersFromCollege = await prisma.user.findMany({
      where: {
        collegeId: college.id,
      },
      select: {
        username: true,
      },
    });

    const userScores = await Promise.all(
      allUsersFromCollege.map(async (user) => {
        try {
          const leetcodedata = await fetchLeetCodeData(user.username);
          const score = calculateScore(leetcodedata.data.matchedUser.submitStats);
          const existingRanking = await prisma.ranking.findFirst({
            where: {
              username: user.username,
              collegeId: college.id,
            },
          });
          if (existingRanking) {
            await prisma.ranking.update({
              where: {
                id: existingRanking.id,
              },
              data: {
                score: score,
              },
            });
          } else {
            await prisma.ranking.create({
              data: {
                username: user.username,
                collegeId: college.id,
                score: score,
              },
            });
          }

          return { username: user.username, score };
        } catch (error) {
          console.error(`Error fetching data for ${user.username}`, error);
          return { username: user.username, score: 0 };
        }
      })
    );

    const rankings = await prisma.ranking.findMany({
      where: {
        collegeId: college.id,
      },
      orderBy: {
        score: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const leaderboard = rankings.map((rank, index) => ({
      rank: index + 1,
      username: rank.user.username,
      score: rank.score || 0,
    }));

    return NextResponse.json({
      totalUsers: rankings.length,
      leaderboard,
      collegeName: college.name,
    });
  } catch (error) {
    console.error("Error in ranking system:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
