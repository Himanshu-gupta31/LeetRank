import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/db";
export async function GET(request:NextRequest) {
    try {
        const {searchParams}=new URL(request.url)
        const college=searchParams.get("college")
        if (!college) {
            return NextResponse.json(
              { success: false, message: "College not provided" },
              { status: 400 }
            );
          }
          const rankedUser=await prisma.ranking.findMany({
            where:{
                user:{
                    college,
                },
            },
            orderBy:[
                {totalques:'desc'},
                {hardques:'desc'},
                {mediumques:'desc'},
                {easyques:'desc'}
            ],
            include:{
                user:true
            }
          });
          return NextResponse.json({ success: true, rankedUser },{status:200});

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
          );
    }
}