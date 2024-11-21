import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";


export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get("college");
    const username = searchParams.get("username");

    if (!college || !username) {
      return NextResponse.json(
        { success: false, message: "College or Username not provided" },
        { status: 400 }
      );
    }
    const rankedUser = await prisma.ranking.findMany({
      where: {
       
      },
      include: {
        user: true,
      },
    });

    const sortedRank = rankedUser.sort((a, b) => {
      const totalA = Number(a.totalques);
      const totalB = Number(b.totalques);
      const hardA = Number(a.hardques);
      const hardB = Number(b.hardques);
      const mediumA = Number(a.mediumques);
      const mediumB = Number(b.mediumques);
      const easyA = Number(a.easyques);
      const easyB = Number(b.easyques);

      if (totalB !== totalA) {
        return totalB - totalA;
      }
      if (hardB !== hardA) {
        return hardB - hardA;
      }
      if (mediumB !== mediumA) {
        return mediumB - mediumA;
      }
      return easyB - easyA;
    });

    const userIndex = sortedRank.findIndex((user) => user.user.username === username);
    const userRank = userIndex !== -1 ? userIndex + 1 : 1;

    return NextResponse.json({ success: true, userRank }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
