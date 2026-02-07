"use client";

import { Bet } from "@/store/betStore";
import { DollarSign, Users } from "lucide-react";

export default function BetCard({
  bet,
  selectedOption,
  onSelect,
  onRefund
}: {
  bet: Bet;
  selectedOption?: string;
  onSelect: (betId: string, option: string) => void;
  onRefund: (betId: string) => void;
}) {
  const totalVolume = bet.real_volume + bet.test_volume;
  const totalUsers = bet.real_users + bet.test_users;

  return (
    <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{bet.question}</h2>

      <div className="space-y-3">
        {bet.options.map((opt, i) => {
          const combinedCount =
            opt.real_count + opt.test_count;

          const percent =
            totalUsers === 0
              ? 0
              : Math.round((combinedCount / totalUsers) * 100);

          const isSelected = selectedOption === opt.value;

          return (
            <button
              key={i}
              disabled={!!selectedOption}
              onClick={() => onSelect(bet.id, opt.value)}
              className={`w-full text-left p-3 rounded-lg border transition relative overflow-hidden
                ${isSelected
                  ? "border-0 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
                  : "bg-zinc-800 border-zinc-700"
                }
                ${selectedOption && !isSelected
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
                <span className="text-zinc-400">{percent}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div className="mt-3 text-sm text-green-400 font-medium">
          You placed a bet on: {selectedOption}
        </div>
      )}

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

      {selectedOption && (
        <button
          onClick={() => onRefund(bet.id)}
          className="mt-4 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Cancel Bet & Refund
        </button>
      )}
    </div>
  );
}
