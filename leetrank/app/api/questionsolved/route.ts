import { NextRequest,NextResponse } from "next/server";
export async function GET(request:NextRequest,response:NextResponse) {
    try {
        const {searchParams}=new URL(request.url);
        const username=searchParams.get("username")
        if(!username){
            return NextResponse.json({success: false, message: "Username is required" }, { status: 400 });
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