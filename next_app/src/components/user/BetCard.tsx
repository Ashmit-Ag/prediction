"use client";

import { useState } from "react";
import { Bet } from "@/store/betStore";
import { DollarSign, Users } from "lucide-react";

export default function BetCard({
  bet,
  userBet,
  onSelect,
  onRefund,
}: {
  bet: Bet;
  userBet?: { option: string; amount: number };
  onSelect: (betId: string, option: string) => void;
  onRefund: (betId: string) => void;
}) {
  const [showRefundPopup, setShowRefundPopup] = useState(false);

  const totalVolume = bet.real_volume + bet.test_volume;
  const totalUsers = bet.real_users + bet.test_users;

  /* ===== BET STATUS ===== */
  const now = new Date();
  const start = new Date(bet.start_date);
  const end = new Date(bet.end_date);

  const hasStarted = start <= now;
  const hasEnded = end < now;

  let status: "live" | "upcoming" | "ended" = "upcoming";
  if (hasStarted && !hasEnded) status = "live";
  if (hasEnded) status = "ended";

  const formatDate = (d: Date) =>
    d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6 shadow-lg">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">{bet.question}</h2>

          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full
              ${status === "live" && "bg-red-600 animate-pulse"}
              ${status === "upcoming" && "bg-yellow-600"}
              ${status === "ended" && "bg-zinc-600"}
            `}
          >
            {status.toUpperCase()}
          </span>
        </div>

        {/* TIME INFO */}
        <div className="text-xs text-zinc-400 mb-4 space-y-1">
          <div>Starts: {formatDate(start)}</div>
          <div>Ends: {formatDate(end)}</div>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3">
          {bet.options.map((opt, i) => {
            const combinedCount =
              opt.real_count + opt.test_count;

            const percent =
              totalUsers === 0
                ? 0
                : Math.round(
                    (combinedCount / totalUsers) * 100
                  );

            const isSelected =
              userBet?.option === opt.value;

            return (
              <button
                key={i}
                disabled={!!userBet || status !== "live"}
                onClick={() =>
                  onSelect(bet.id, opt.value)
                }
                className={`w-full text-left p-3 rounded-lg border transition relative overflow-hidden
                  ${
                    isSelected
                      ? "border-0 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
                      : "bg-zinc-800 border-zinc-700"
                  }
                  ${
                    userBet && !isSelected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-zinc-700"
                  }`}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-r ${
                    isSelected
                      ? "from-purple-500 to-pink-500"
                      : "from-purple-500/50 to-pink-500/50"
                  }`}
                  style={{ width: `${percent}%` }}
                />

                <div className="relative flex justify-between font-medium">
                  <span>{opt.value}</span>
                  <span className="text-zinc-400">
                    {percent}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* USER BET INFO */}
        {userBet && (
          <div className="mt-3 text-sm text-green-400 font-medium">
            You placed ${userBet.amount.toLocaleString()} on:{" "}
            {userBet.option}
          </div>
        )}

        {/* TOTALS */}
        <div className="mt-4 text-sm text-zinc-400 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <DollarSign size={16} />
            {totalVolume.toLocaleString()}
          </span>

          <span className="flex items-center gap-1">
            <Users size={16} />
            {totalUsers} users
          </span>
        </div>

        {/* REFUND BUTTON */}
        {userBet && (
          <button
            onClick={() => setShowRefundPopup(true)}
            className="mt-4 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Cancel Bet & Refund
          </button>
        )}
      </div>

      {/* REFUND POPUP */}
      {showRefundPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Cancel Bet?
            </h3>

            <p className="text-sm text-zinc-400 mb-6">
              Your bet will be cancelled and the
              amount refunded.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundPopup(false)}
                className="flex-1 py-2 rounded-lg bg-zinc-800"
              >
                Keep Bet
              </button>

              <button
                onClick={() => {
                  onRefund(bet.id);
                  setShowRefundPopup(false);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
