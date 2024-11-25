import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
export async function GET(req:NextRequest){
    const {userId}=getAuth(req);
    if(!userId){
        return NextResponse.json(
            {
                message:"User not authenticated"
            },
            {
                status:400
            }
        )
    }
    try {
        const profile=await prisma.user.findUnique({
            where:{
                clerkId:userId
            },
            select:{
                username:true,
                college:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })
        if(!profile || !profile.username || !profile.college){
            return NextResponse.json({
                message:"User profile incomplete"
            },
            {
               status:400
            }
        )
        }
        const allUsersFromCollege=await prisma.user.findMany({
            where:{
                collegeId:profile.college.id
            },
            select:{
                username:true
            }
        });
        const rankings=await prisma.ranking.findMany({
            where:{
                collegeId:profile.college.id
            },
            orderBy:{
                score:'desc'
            },
            include:{
                user:{
                    select:{
                        username:true
                    }
                }
            }
        })
        const userRank=rankings.findIndex((rank)=> rank.username === profile.username)+1
        return NextResponse.json({message:"User ranking fetched successfully",userRank},{status:200})
    } catch (error) {
        console.error("Error in ranking system:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
