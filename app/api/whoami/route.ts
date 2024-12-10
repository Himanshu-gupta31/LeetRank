import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db"

export async function GET(req:NextRequest) {
    const {userId} = getAuth(req) 
    try {
        const user = await prisma.user.findFirst({
            where : {
                clerkId : userId
            }
        })

        if (!user) {
            return NextResponse.json({
                message : "User is not authenticated!"
            },{
                status : 401
            })
        }
        return user;
    } catch (error) {
        console.error("Unable to fetch the user",error)
        return NextResponse.json({
            message : "Internal server error, please try again!"
        },{
            status : 500
        })
    }
}