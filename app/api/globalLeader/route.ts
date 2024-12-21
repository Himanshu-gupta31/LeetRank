import prisma from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import { NextRequest,NextResponse } from "next/server"
export async function GET(req:NextRequest) {
    const {userId}=getAuth(req)
    if(!userId){
        return NextResponse.json({message:"User not authenticated"},{status:400})
    }
    try {
        const rankings=await prisma.ranking.findMany({
            
            orderBy:{
                score:"desc"
            },
            select:{
                username:true,
                score:true
            }
        });
        const leaderboard= rankings.map((user,index)=>({
            rank:index+1,
            username:user.username,
            score:user.score
        }))
        const userRank=leaderboard.find((user)=>user.username === userId)?.rank || null
        return NextResponse.json({
            rankings,
            leaderboard,
            userRank,
            totalUsers:leaderboard.length
            
        })
    } catch (error) {
        console.error("Error in Global Leaderboard",error)
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}