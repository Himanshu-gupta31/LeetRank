import { NextRequest, NextResponse } from "next/server";

const userProfileQuery = `#graphql
query getUserProfile($username: String!) {
    allQuestionsCount {
        difficulty
        count
    }
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
        badges {
            id
            displayName
            icon
            creationDate
        }
        upcomingBadges {
            name
            icon
        }
        activeBadge {
            id
            displayName
            icon
            creationDate
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
    recentSubmissionList(username: $username, limit: 20) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
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
  const leetcodeusername = await prisma.user.findUnique({
    where : {
      clerkId : userId
    }, select : {
      // leetcodeusername
    }
  })

  if (!username) {
    return NextResponse.json({
      message: "Please provide a LeetCode username.",
    }, { status: 400 });
  }

  try {
    const [userProfileData, languageStatsData] = await Promise.all([
      fetchLeetCodeData(username, userProfileQuery),
      fetchLeetCodeData(username, languageStatsQuery)
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
