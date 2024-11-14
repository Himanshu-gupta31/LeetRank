import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";

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
        const {solvedProblem,mediumSolved,hardSolved,easySolved}=responsedata;
        const questionsData=await prisma.ranking.create({
            data:{
                userId:user.id,
                totalques:String(solvedProblem),
                easyques:String(easySolved),
                mediumques:String(mediumSolved),
                hardques:String(hardSolved)
            }
        })
        return NextResponse.json({success:true,message:"Question Data Fetched Successfully",questionsData})
        
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
          );
    }
}