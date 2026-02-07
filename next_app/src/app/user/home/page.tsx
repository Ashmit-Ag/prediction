"use client";

import { useEffect, useRef, useState } from "react";
import BetCard from "@/components/user/BetCard";
import { useBetsStore } from "@/store/betStore";
import { useSocket } from "@/hooks/useSocket";
import { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useUserBetsSocket } from "@/hooks/useUserBetsSocket";

export default function BetsPage() {
  const { data: session } = useSession();

  const socket = useSocket(
    "user",
    session?.user?.id
  );  
  const socketRef = useRef<Socket | null>(null);


  const bets = useBetsStore((s) => s.bets);

  const [selected, setSelected] = useState<{
    betId: string;
    option: string;
  } | null>(null);

  const [amount, setAmount] = useState("");
  const [selectedOptionMap, setSelectedOptionMap] =
    useState<Record<string, string>>({});

  /* SOCKET LISTENERS */
  useUserBetsSocket({
    socket,
    userId: session?.user?.id,
    setSelectedOptionMap,
  });

  /* IMPORTANT FIX */
  useEffect(() => {
    if (socket) socketRef.current = socket;
  }, [socket]);

  /* SELECT OPTION */
  const handleSelect = (betId: string, option: string) => {
    if (selectedOptionMap[betId]) {
      alert("You already placed a bet on this.");
      return;
    }

    // ONLY open modal — do NOT mark selected yet
    setSelected({ betId, option });
  };


  /* PLACE BET */
  const placeBet = () => {
    if (!selected || !amount || !socketRef.current) return;

    socketRef.current.emit("bet:place", {
      betId: selected.betId,
      option: selected.option,
      amount: Number(amount) || 0,
      userId: "user-" + session?.user.id,
    });

    // mark selected ONLY after confirm
    setSelectedOptionMap(prev => ({
      ...prev,
      [selected.betId]: selected.option,
    }));

    setSelected(null);
    setAmount("");
  };


  /* REFUND BET */
  const refundBet = (betId: string) => {
    if (!socketRef.current) return;

    if (!confirm("Cancel this bet? Money will be refunded.")) return;

    socketRef.current.emit("bet:refund", {
      betId,
      userId: "user-" + session?.user.id,
    });

    setSelectedOptionMap((prev) => {
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
            selectedOption={selectedOptionMap[bet.id]}
            onSelect={handleSelect}
            onRefund={() => refundBet(bet.id)}
          />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Place Bet —{" "}
              <span className="text-pink-400">
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
