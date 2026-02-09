import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, betId, option, amount, risk } = body;

    if (!userId || !betId || !option || !amount) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // check existing vote
    const existing = await prisma.vote.findFirst({
      where: { userId, betId },
    });

    let vote;

    if (existing) {
      // update vote
      vote = await prisma.vote.update({
        where: { id: existing.id },
        data: {
          option,
          amount,
          risk: risk ?? 0,
        },
      });
    } else {
      // create vote
      vote = await prisma.vote.create({
        data: {
          userId,
          betId,
          option,
          amount,
          risk: risk ?? 0,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ vote });
  } catch (err) {
    console.error("Vote API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
