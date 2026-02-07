import { deleteBetAction } from "@/lib/manager/managerBetActions";
import { Bet } from "@/store/betStore";
import { Socket } from "socket.io-client";
import { DollarSign, Users } from "lucide-react";

export default function ManagerBetCard({
  bet,
  dataMode,
  socket,
  onEdit,
}: {
  bet: Bet;
  dataMode: "real" | "test";
  socket: Socket | null;
  onEdit: (b: Bet) => void;
}) {
  const isReal = dataMode === "real";

  const totalUsers = isReal
    ? bet.real_users
    : bet.test_users;

  const totalVolume = isReal
    ? bet.real_volume
    : bet.test_volume;

  const barColor = isReal
    ? "from-green-500/60 to-green-400/60"
    : "from-red-500/60 to-red-400/60";

  const statColor = isReal
    ? "text-green-400"
    : "text-red-400";

  return (
    <div className="bg-zinc-900/70 border border-zinc-700 rounded-xl p-6 shadow-lg space-y-4">

      <h2 className="text-xl font-semibold">
        {bet.question}
      </h2>

      {/* OPTIONS */}
      <div className="space-y-3">
        {bet.options.map((opt, i) => {
          const count = isReal
            ? opt.real_count
            : opt.test_count;

          const percent =
            totalUsers === 0
              ? 0
              : Math.round((count / totalUsers) * 100);

          return (
            <div
              key={i}
              className="relative p-3 rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-linear-to-r ${barColor}`}
                style={{ width: `${percent}%` }}
              />

              <div className="relative flex justify-between font-medium">
                <span>{opt.value}</span>
                <span className="text-zinc-300">
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* STATS */}
      <div className="flex justify-between text-sm items-center">
        <span className={`flex items-center gap-1 ${statColor}`}>
          <Users size={16} />
          {totalUsers} users
        </span>

        <span className={`flex items-center gap-1 ${statColor}`}>
          <DollarSign size={16} />
          {totalVolume.toLocaleString()}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onEdit(bet)}
          className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold"
        >
          Edit Bet
        </button>

        <button
          onClick={() =>
            deleteBetAction(socket, bet.id)
          }
          className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
