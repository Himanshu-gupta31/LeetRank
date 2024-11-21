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

async function fetchLeetCodeData(username: string, query: string) {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
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

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if(!userId){
    return NextResponse.json({
      message:"User Id cannot be null"
    },{status:400})
  }
  const profile = await prisma.user.findUnique({
    where : {
      clerkId : userId
    }, select : {
      username:true
    }
  })

  if (!profile) {
    return NextResponse.json({
      message: "Please provide a LeetCode username.",
    }, { status: 400 });
  }

  try {
    const [userProfileData, languageStatsData] = await Promise.all([
      fetchLeetCodeData(profile.username, userProfileQuery),
      fetchLeetCodeData(profile.username, languageStatsQuery)
    ]);

    return NextResponse.json({
      userProfile: userProfileData.data,
      languageStats: languageStatsData.data,
    });
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    return NextResponse.json({
      message: "An error occurred while fetching LeetCode data.",
    }, { status: 500 });
  }
}
