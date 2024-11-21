// this will be route to calculate the ranks of all the users belonging to a college

import { getAuth } from "@clerk/nextjs/server";
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

function calculateScore(submitStats : any) {
    const weights = { Easy : 1, Medium : 3, Hard : 5};
    return submitStats.acSubmissionNum.reduce((score : number,stat : any) => {
        return score + (stat.count * (weights[stat.difficulty as keyof typeof weights] || 0))
    },0) 
}

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req); // this checks on the server if the user is authenticated or not, if they are then their clerkId is fetched
  if (!userId) {
    return NextResponse.json(
      {
        message: "User not authenticated",
      },
      { status: 400 }
    );
  }

  try {
    const profile = await prisma.user.findUnique({
        where : {
            clerkId : userId
        },
        select : {
            username : true,
            college : {
                select : {
                    id : true,
                    name : true
                }
            }
        }
    })

    if (!profile || !profile.username || !profile.college) {
        return NextResponse.json({ message: "User profile incomplete" }, { status: 400 });
    }

    const allUsersFromCollege = await prisma.user.findMany({
        where : {
            collegeId : profile.college.id
        },
        select : {
            username : true
        }
    })

    const userScores = await Promise.all(
        allUsersFromCollege.map( async (user) => {
            try {
                const leetcodedata = await fetchLeetCodeData(user.username)
                const score = calculateScore(leetcodedata.data.matchedUser.submitStats)
                return {username : user.username,score}
            } catch (error) {
                console.error(`Error fetching data for ${user.username}`,error)
                return {username: user.username,score : 0}
            }
        })
    )

    const sortedUsers = userScores.sort((a,b) => b.score - a.score)
    const userRank = userScores.findIndex((user) => user.username === profile.username) + 1;

    const leaderboard = sortedUsers.map((user,index) => ({
        rank : index + 1,
        username : user.username,
        score : user.score
    }))

    return NextResponse.json({
        userRank,
        totalUsers: sortedUsers.length,
        leaderboard,
        collegeName: profile.college.name,
      });
  } catch (error) {
    console.error("Error in ranking system:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }

}
