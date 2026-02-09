import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, betId } = await req.json();

    if (!userId || !betId) {
      return NextResponse.json(
        { error: "Missing userId or betId" },
        { status: 400 }
      );
    }

    const vote = await prisma.vote.findFirst({
      where: { userId, betId },
    });

    if (!vote) {
      return NextResponse.json(
        { error: "Vote not found" },
        { status: 404 }
      );
    }

    await prisma.vote.delete({
      where: { id: vote.id },
    });

    return NextResponse.json({
      success: true,
      message: "Bet refunded successfully",
    });
  } catch (err) {
    console.error("Refund vote error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
