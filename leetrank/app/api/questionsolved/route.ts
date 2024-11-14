import { NextRequest,NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request:NextRequest) {
    try {
        const {searchParams}=new URL(request.url);
        const username=searchParams.get("username")
        const college=searchParams.get("college")
        if(!username || !college){
            return NextResponse.json({success: false, message: "Username or College is required" }, { status: 400 });
        }
        const leetcodeUrl=`https://alfa-leetcode-api.onrender.com/${username}/solved`;
        const leetcodeResponse=await fetch(leetcodeUrl)
        const profileData=await leetcodeResponse.json()
        return NextResponse.json({success:true,profileData},{status:200})
    } catch (error) {
        console.error("Error fetching LeetCode profile:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching LeetCode profile" },
            { status: 500 }
        );
    }
}