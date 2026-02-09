-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('UPCOMING', 'LIVE', 'ENDED', 'SETTLED');

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "options" JSONB NOT NULL,
    "correctOption" TEXT,
    "proofImageUrl" TEXT,
    "status" "BetStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);
