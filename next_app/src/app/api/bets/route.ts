import { NextResponse } from "next/server";

export async function GET() {
  const fakeBets = [
    {
      id: "1",
      question: "Will Bitcoin cross $100k in 2026?",
      volume: 24500,
      users: 120,
      start_date: "2026-02-01",
      end_date: "2026-12-31",
      created_at: new Date().toISOString(),
      correct_option: null,
      winners: [],
      options: [
        { value: "Yes", user_count: 70 },
        { value: "No", user_count: 50 },
      ],
    },
    {
      id: "2",
      question: "Will AI replace junior developers by 2027?",
      volume: 18000,
      users: 90,
      start_date: "2026-01-15",
      end_date: "2027-01-15",
      created_at: new Date().toISOString(),
      correct_option: null,
      winners: [],
      options: [
        { value: "Yes", user_count: 40 },
        { value: "No", user_count: 50 },
      ],
    },
    {
      id: "3",
      question: "India to win next Cricket World Cup?",
      volume: 32000,
      users: 210,
      start_date: "2026-03-01",
      end_date: "2027-03-01",
      created_at: new Date().toISOString(),
      correct_option: null,
      winners: [],
      options: [
        { value: "Yes", user_count: 150 },
        { value: "No", user_count: 60 },
      ],
    },
  ];

  return NextResponse.json(fakeBets);
}
