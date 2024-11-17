import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await prisma.college.findMany();
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Unable to fetch all the colleges.");
    return NextResponse.json(
      { error: "Unable to fetch colleges" },
      { status: 400 }
    );
  }
}
