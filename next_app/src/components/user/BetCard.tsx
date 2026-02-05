"use client";

type Option = {
  value: string;
  user_count: number;
};

type Bet = {
  id: string;
  question: string;
  volume: number;
  users: number;
  options: Option[];
};

export default function BetCard({
  bet,
  selectedOption,
  onSelect,
}: {
  bet: Bet;
  selectedOption?: string;
  onSelect: (betId: string, option: string) => void;
}) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{bet.question}</h2>

      <div className="space-y-3">
        {bet.options.map((opt, i) => {
          const percent =
            bet.users === 0
              ? 0
              : Math.round((opt.user_count / bet.users) * 100);

          const isSelected = selectedOption === opt.value;

          return (
            <button
              key={i}
              onClick={() => onSelect(bet.id, opt.value)}
              className={`w-full text-left p-3 rounded-lg border transition relative overflow-hidden
                ${
                  isSelected
                    ? "border-0 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
                    : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                }`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-r ${isSelected?"from-purple-500 to-pink-500":"from-purple-500/50 to-pink-500/50"}`}
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

      <div className="mt-4 text-sm text-zinc-400 flex justify-between">
        <span>💰 ${bet.volume.toLocaleString()}</span>
        <span>👥 {bet.users} users</span>
      </div>
    </div>
  );
}
