import { NextRequest,NextResponse } from "next/server"
import prisma from "@/lib/db"
export async function POST(request:NextRequest,response:NextResponse) {
    try {
        const {username,college}=await request.json()
        if(!username || !college){
            return NextResponse.json({success:false,message:"All Fields are required"},{status:400})
        }
        const existingUser=await prisma.user.findUnique({
            where:{username},
        })
        if(existingUser){
            return NextResponse.json({success:false,message:"Username already Exist"},{status:400})
        }
        const newUser=await prisma.user.create({
            data:{
                college:college,
                username:username
            },
        })
        return NextResponse.json({success:true,message:"User Registered Successfully",newUser},{status:200})
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { success: false, error: "Error creating user" },
            { status: 500 }
    )}
    
}