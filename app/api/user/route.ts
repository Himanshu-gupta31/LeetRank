// this is the user?clerkId=something route this will hit to fetch the user from the database.
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  if (!clerkId) {
    return NextResponse.json({ error: "Missing ClerkId" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId as string },
      select : {
        clerkusername : true,
        username : true,
        college : true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    return NextResponse.json({user},{status : 200});
  } catch (error) {
    console.error("Error fetching the user", error);
    return NextResponse.json(
      { error: "Internal server has occured." },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { clerkId, email, clerkusername } = await req.json();

//     if (!clerkId || !email || !clerkusername) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const upsertedUser = await prisma.user.upsert({
//       where : {clerkId : clerkId},
//       update : {
//         email,
//         clerkusername
//       },
//       create : {
//         clerkId,
//         email,
//         clerkusername
//       }
//     })
//     return NextResponse.json(upsertedUser);
//   } catch (error) {
//     console.error("Error creating new user", error);
//     return NextResponse.json(
//       { error: "Internal server error has occurred!" },
//       { status: 500 }
//     );
//   }
// }
