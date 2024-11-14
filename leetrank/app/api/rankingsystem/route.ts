import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/db";
export async function GET(request:NextRequest) {
    try {
        const {searchParams}=new URL(request.url)
        const college=searchParams.get("college")
        const username=searchParams.get("username")
        if (!college || !username) {
            return NextResponse.json(
              { success: false, message: "College or Username not provided" },
              { status: 400 }
            );
          }
          const rankedUser=await prisma.ranking.findMany({
            where:{
                user:{
                    college,
                },
            },
            
            include:{
                user:true
            }
          });
          const sortedrank=rankedUser.sort((a:any,b:any)=>
            {
                if(b.totalques!==a.totalques){
                    return b.totalques-a.totalques
                }
                if(b.hardques!==a.hardques){
                    return b.hardques-a.hardques
                }
                if(b.mediumques!==a.mediumques){
                    return b.mediumques-a.mediumques
                }
                return b.easyques-a.easyques //  TODO:fiX Karna hai isko aaj
            })

          const userIndex=sortedrank.findIndex((user)=>user.user.username===username)
          const userRank=userIndex!==-1 ? userIndex+1 : null
          return NextResponse.json({ success: true, userRank },{status:200});
       
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error",error },
            { status: 500 }
          );
    }
}