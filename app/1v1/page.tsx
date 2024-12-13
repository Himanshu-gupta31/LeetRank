"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Search,
  AlertCircle,
  Medal,
  Building2,
  Share2,
  Copy,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";

interface LanguageStats {
  languageName: string;
  problemsSolved: number;
}

interface UserProfile {
  userProfile: {
    matchedUser: {
      username: string;
      githubUrl: string;
      twitterUrl: string;
      linkedinUrl: string;
      contributions: {
        points: number;
        questionCount: number;
        testcaseCount: number;
      };
      profile: {
        realName: string;
        userAvatar: string;
        birthday: string;
        ranking: number;
        reputation: number;
        websites: string[];
        countryName: string;
        company: string;
        school: string;
        skillTags: string[];
        aboutMe: string;
        starRating: number;
      };
      submitStats: {
        totalSubmissionNum: {
          difficulty: string;
          count: number;
          submissions: number;
        }[];
        acSubmissionNum: {
          difficulty: string;
          count: number;
          submissions: number;
        }[];
      };
      submissionCalendar: string;
    };
  };
  languageStats: {
    matchedUser: {
      languageProblemCount: LanguageStats[];
    };
  };
  collegeData: {
    id: string;
    name: string;
    slug: string;
    area: string;
    state: string;
    country: string;
  };
  username: string;
  leetcodeScore?: number;
}

export default function OneVOne() {
  const [compareUsername, setCompareUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserData, setLoggedInUserData] = useState<UserProfile | null>(
    null
  );
  const [comparisonUserData, setComparisonUserData] =
    useState<UserProfile | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    fetchLoggedInUserData();
  }, []);

  const captureComparison = async () => {
    if (comparisonRef.current && loggedInUserData && comparisonUserData) {
      const canvas = await html2canvas(comparisonRef.current);
      const imageDataUrl = canvas.toDataURL("image/png");
      setShareUrl(imageDataUrl);

      // Create metadata for social media sharing
      const title = `${loggedInUserData.username} vs ${comparisonUserData.username} LeetCode Battle`;
      const description = `${loggedInUserData.username} ${
        (loggedInUserData.leetcodeScore || 0) >
        (comparisonUserData.leetcodeScore || 0)
          ? "won"
          : "lost"
      } the LeetCode battle against ${comparisonUserData.username}`;

      // Update metadata tags
      updateMetaTags(title, description, imageDataUrl);
    }
  };

  async function fetchLoggedInUserData() {
    try {
      setLoading(true)
      const response = await fetch("/api/leetcodedata");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setLoggedInUserData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
    } finally {
      setLoading(false)
    }
  }

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compareUsername }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to compare users");
      }

      const data = await response.json();
      setComparisonUserData(data.user2);
      // Update logged in user data with the latest score
      setLoggedInUserData((prevData) => ({
        ...prevData!,
        leetcodeScore: data.user1.leetcodeScore,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function StatCard({
    title,
    value,
    color,
  }: {
    title: string;
    value: number;
    color: string;
  }) {
    return (
      <div className={`rounded-lg ${color} p-4`}>
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    );
  }

  function UserCard({
    user,
    showMedal,
  }: {
    user: UserProfile;
    showMedal: boolean;
  }) {
    const totalSolved =
      user.userProfile.matchedUser.submitStats.acSubmissionNum.find(
        (stat) => stat.difficulty === "All"
      )?.count || 0;

    return (
      <Card className="bg-[#1A1A1A] border-[#333]">
        <CardHeader className="flex flex-row items-center space-x-4">
          <img
            src={
              user.userProfile.matchedUser.profile.userAvatar ||
              "/placeholder.svg"
            }
            alt={`${user.username}'s avatar`}
            className="w-16 h-16 rounded-full"
          />
          <div className="flex items-center">
            <div>
              <CardTitle className="text-xl text-white">
                {user.username}
              </CardTitle>
              {user.collegeData && (
                <div className="flex items-center mt-2">
                  <Building2 className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-400">
                    {user.collegeData.name}
                  </span>
                </div>
              )}
            </div>
            {showMedal && <Medal className="w-8 h-8 text-yellow-500 ml-4" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Global Rank"
              value={user.userProfile.matchedUser.profile.ranking}
              color="bg-gray-800"
            />
            <StatCard
              title="Total Solved"
              value={totalSolved}
              color="bg-gray-800"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {user.userProfile.matchedUser.submitStats.acSubmissionNum
              .filter((stat) => stat.difficulty !== "All")
              .map((stat) => (
                <StatCard
                  key={stat.difficulty}
                  title={stat.difficulty}
                  value={stat.count}
                  color={
                    stat.difficulty === "Easy"
                      ? "bg-blue-600"
                      : stat.difficulty === "Medium"
                      ? "bg-orange-600"
                      : "bg-red-600"
                  }
                />
              ))}
          </div>
          {user.leetcodeScore && (
            <Badge className="flex justify-center items-center mt-5 text-xl">
              Leetcode Score : {user.leetcodeScore}
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  }

  const updateMetaTags = (title: string,description: string,imageUrl: string) => {
    // Update Open Graph meta tags
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute("content", imageUrl);

    // Update Twitter Card meta tags
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute("content", title);
    document
      .querySelector('meta[name="twitter:description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[name="twitter:image"]')
      ?.setAttribute("content", imageUrl);
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        const blob = await fetch(shareUrl).then((r) => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        alert("Image copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy image: ", err);
        alert("Failed to copy image. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-3xl font-bold">Compare LeetCode Stats</h1>
            {loggedInUserData && comparisonUserData && (
              <Badge className="px-2 py-2">
                <h4 className="text-3xl max-sm:text-md font-bold">
                  {loggedInUserData ? loggedInUserData?.username : "Loading..."}{" "}
                  Vs.{" "}
                  {comparisonUserData
                    ? comparisonUserData.username
                    : "Enter username!"}
                </h4>
              </Badge>
            )}
            <div className="w-full max-w-md flex gap-2">
              <Input
                type="text"
                placeholder="Enter LeetCode username to compare"
                value={compareUsername}
                onChange={(e) => setCompareUsername(e.target.value)}
                className="bg-[#1A1A1A] border-[#333] text-white"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div ref={comparisonRef} className="grid md:grid-cols-2 gap-8">
            {loggedInUserData && (
              <UserCard
                user={loggedInUserData}
                showMedal={
                  comparisonUserData
                    ? (loggedInUserData.leetcodeScore || 0) >
                      (comparisonUserData.leetcodeScore || 0)
                    : false
                }
              />
            )}
            {comparisonUserData ? (
              <UserCard
                user={comparisonUserData}
                showMedal={
                  loggedInUserData
                    ? (comparisonUserData.leetcodeScore || 0) >
                      (loggedInUserData.leetcodeScore || 0)
                    : false
                }
              />
            ) : (
              <Card className="bg-[#1A1A1A] border-[#333] flex items-center justify-center">
                { !loading &&
                  <CardContent>
                  <p className="text-gray-400">Enter a username to compare!</p>
                </CardContent>
                }
                  {loading && <Loader2 className="animate-spin flex justify-center text-center items-center" color="white" />}
              </Card>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleCompare}
              disabled={loading || !compareUsername}
            >
              {loading ? `Loading...` : "Compare"}
            </Button>
            {loggedInUserData && comparisonUserData && (
              <Button onClick={captureComparison} className="mx-2">
                <Share2 className="w-4 h-4" />
                Share Result
              </Button>
            )}
            {shareUrl && (
              <Button onClick={copyToClipboard} className="mx-4">
                <Copy className="w-4 h-" />
                Copy to Clipboard
              </Button>
            )}
          </div>

          {shareUrl && (
            <div className="mt-4 text-center">
              <p>Share this image on social media:</p>
              <img
                src={shareUrl}
                alt="LeetCode Comparison Result"
                className="mx-auto mt-2 max-w-full"
              />
            </div>
          )}
        </div>
    </div>
  );
}
