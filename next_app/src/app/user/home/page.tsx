"use client";

import { useEffect, useState } from "react";
import BetCard from "@/components/user/BetCard";
import { useBetsStore } from "@/store/betStore";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import { useUserBetsSocket } from "@/hooks/useUserBetsSocket";

export default function BetsPage() {
  const { data: session } = useSession();

  const socket = useSocket("user", session?.user?.id);
  const bets = useBetsStore((s) => s.bets);

  const [selected, setSelected] = useState<{ betId: string; option: string; } | null>(null);

  const [amount, setAmount] = useState("");
  // const [selectedOptionMap, setSelectedOptionMap] = useState<Record<string, string>>({});
  const [selectedOptionMap, setSelectedOptionMap] =
    useState<Record<string, { option: string; amount: number }>>({});


  /* SOCKET SYNC */
  useUserBetsSocket({ socket, userId: session?.user?.id, setSelectedOptionMap });

  /* LOAD USER VOTES FROM DB (PERSISTENCE) */
  useEffect(() => {
    if (!session?.user?.id) return;

    fetch("/api/user/votes", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, { option: string; amount: number }> = {};
        data.votes?.forEach((v: any) => {
          map[v.betId] = {
            option: v.option,
            amount: v.amount,
          };
        });

    setSelectedOptionMap(map);
  });
}, [session]);

/* SELECT OPTION */
const handleSelect = (betId: string, option: string) => {
  if (selectedOptionMap[betId]) {
    alert("You already placed a bet on this.");
    return;
  }

  setSelected({ betId, option });
};

/* PLACE BET */
const placeBet = async () => {
  if (!selected || !amount || !session?.user?.id || !socket) return;

  const amt = Number(amount);

  /* SAVE TO DB FIRST */
  await fetch("/api/vote", {
    method: "POST",
    body: JSON.stringify({
      userId: session.user.id,
      betId: selected.betId,
      option: selected.option,
      amount: amt,
    }),
  });

  /* REALTIME SOCKET UPDATE */
  socket.emit("bet:place", {
    betId: selected.betId,
    option: selected.option,
    amount: amt,
  });

  setSelectedOptionMap((prev) => ({
    ...prev,
    [selected.betId]: {
      option: selected.option,
      amount: amt,
    },
  }));
  
  setSelected(null);
  setAmount("");
};

/* REFUND BET */
const refundBet = async (betId: string) => {
  if (!session?.user?.id || !socket) return;

  // Remove from DB
  await fetch("/api/vote/refund", {
    method: "POST",
    body: JSON.stringify({
      userId: session.user.id,
      betId,
    }),
  });

  // Realtime update
  socket.emit("bet:refund", { betId });

  // UI cleanup
  setSelectedOptionMap(prev => {
    const copy = { ...prev };
    delete copy[betId];
    return copy;
  });
};


return (
  <div className="h-screen flex flex-col text-white">
    <div className="bg-zinc-900 px-6 py-5 border-b border-zinc-800">
      <h1 className="text-3xl text-center font-bold">
        Active Bets
      </h1>
    </div>

    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-28 space-y-6">
      {bets.map((bet) => (
        <BetCard
          key={bet.id}
          bet={bet}
          userBet={selectedOptionMap[bet.id]}
          onSelect={handleSelect}
          onRefund={() => refundBet(bet.id)}
        />
      ))}
    </div>

    {/* BET MODAL */}
    {selected && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-4">
            Place Bet —
            <span className="text-pink-400 ml-1">
              {selected.option}
            </span>
          </h3>

          <input
            type="number"
            placeholder="Enter amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <div className="flex gap-3">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 py-2 rounded-lg bg-zinc-800"
            >
              Cancel
            </button>

            <button
              disabled={!amount || Number(amount) <= 0}
              onClick={placeBet}
              className="flex-1 py-2 rounded-lg bg-purple-600 font-semibold disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
