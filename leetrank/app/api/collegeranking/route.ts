import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/db";
export async function POST(request:NextRequest) {
    try {
        const {searchParams}=new URL(request.url);
        const username=searchParams.get("username");
        const college=searchParams.get("college")
        if(!username || !college){
            return NextResponse.json({success:false,message:"Username or College does not exist"},{status:400})
        }
        let user=await prisma.user.findUnique({
            where:{username}
        })
        if (!user) {
            user = await prisma.user.create({
              data: {
                college: college,
                username: username,
              },
            });
          }
        const leetcodeUrl=`https://alfa-leetcode-api.onrender.com/${username}/solved`;
        const leetcodeResponse=await fetch(leetcodeUrl)
        const responsedata=await leetcodeResponse.json()
        if(!responsedata.success || !responsedata.profileData){
            return NextResponse.json(
                { success: false, message: "Failed to fetch LeetCode data" },
                { status: 500 }
              );
        }
        const {solvedProblem,mediumSolved,hardSolved,easySolved}=responsedata.profileData;
        const questionsData=await prisma.ranking.create({
            data:{
                userId:user.id,
                totalques:solvedProblem,
                easyques:easySolved,
                mediumques:mediumSolved,
                hardques:hardSolved
            }
        })
        return NextResponse.json({success:true,message:"Question Data Fetched Successfully",questionsData})
        
        
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
          );
    }
}