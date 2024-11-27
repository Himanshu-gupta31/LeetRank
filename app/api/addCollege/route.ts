import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
export async function POST(req: NextRequest) {
  try {
    const { collegeName, area, state, country } = await req.json();
    if (!collegeName || !area || !state || !country) {
      return NextResponse.json(
        { error: "All inputs are important!" },
        { status: 500 }
      );
    }

    const res = await prisma.college.create({
      data: {
        name: collegeName,
        area: area,
        state: state,
        country: country,
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error in adding college:", error);
    return NextResponse.json(
      { success: false, error: "Error creating new college" },
      { status: 500 }
    );
  }
}
