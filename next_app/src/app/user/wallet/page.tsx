"use client";

import { useState } from "react";
import { Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";

type Txn = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  title: string;
  date: string;
};

export default function WalletPage() {
  const [balance] = useState(1250); // fake balance

  const transactions: Txn[] = [
    {
      id: "1",
      type: "credit",
      amount: 500,
      title: "Money Added",
      date: "Feb 1, 2026",
    },
    {
      id: "2",
      type: "debit",
      amount: 200,
      title: "Bet Placed",
      date: "Feb 3, 2026",
    },
    {
      id: "3",
      type: "credit",
      amount: 950,
      title: "Bet Won",
      date: "Feb 4, 2026",
    },
  ];

  return (
    <div className="h-screen flex flex-col text-white">
      <div className="bg-zinc-900/90 backdrop-blur px-6 pt-5 pb-4 border-b border-zinc-800">
        <h1 className="text-3xl text-center font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Wallet
        </h1>
      </div>

      <div className="w-full px-5 mt-6">

        {/* Balance Card */}
        <div className="bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-zinc-700 rounded-2xl p-6 mb-6 mt-5 shadow-lg">
          <p className="text-zinc-400 text-sm">Available Balance</p>
          <p className="text-4xl font-bold mt-1">$ {balance.toLocaleString()}</p>

          <button
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl
            bg-linear-to-r from-purple-500 to-pink-500 font-semibold hover:opacity-90 transition"
            >
            <Plus size={18} /> Add Money
          </button>
        </div>

        {/* Transactions */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

          <div className="space-y-4">
            {transactions.map((txn) => (
              <div
              key={txn.id}
              className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      txn.type === "credit"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                    }`}
                    >
                    {txn.type === "credit" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{txn.title}</p>
                    <p className="text-xs text-zinc-400">{txn.date}</p>
                  </div>
                </div>

                <p
                  className={`font-semibold ${
                    txn.type === "credit"
                    ? "text-green-400"
                    : "text-red-400"
                  }`}
                  >
                  {txn.type === "credit" ? "+" : "-"}${txn.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
