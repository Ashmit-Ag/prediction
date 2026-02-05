"use client";

import { useEffect, useState } from "react";
import BetCard from "@/components/user/BetCard";

type Option = {
  value: string;
  user_count: number;
};

type Bet = {
  id: string;
  question: string;
  volume: number;
  users: number;
  start_date: string;
  end_date: string;
  options: Option[];
};

export default function BetsPage() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [selected, setSelected] = useState<{
    betId: string;
    option: string;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedOptionMap, setSelectedOptionMap] = useState<Record<string, string>>({});


  useEffect(() => {
    fetch("/api/bets")
      .then((res) => res.json())
      .then(setBets);
  }, []);

  const handleSelect = (betId: string, option: string) => {
    setSelectedOptionMap((prev) => ({
      ...prev,
      [betId]: option,
    }));
  
    setSelected({ betId, option }); // for modal
  };
  

  const closeModal = () => {
    setSelected(null);
    setAmount("");
  };

  const placeBet = async () => {
    console.log(selected, amount);
    closeModal();
  };

  return (
    <div className="h-screen flex flex-col text-white">
      
      <div className="bg-zinc-900/90 backdrop-blur px-6 pt-5 pb-4 border-b border-zinc-800">
        <h1 className="text-3xl text-center font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Active Bets
        </h1>
      </div>

      {/* Scrollable cards container */}
      <div className="flex-1 overflow-y-auto scrollbar-neon px-6 pt-8 pb-28 space-y-6">
        {bets.map((bet) => (
          <BetCard
            key={bet.id}
            bet={bet}
            selectedOption={selectedOptionMap[bet.id]}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Modal */}
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
              className="w-full mb-4 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-pink-500"
            />

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
              >
                Cancel
              </button>

              <button
                onClick={placeBet}
                className="flex-1 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 font-semibold"
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
