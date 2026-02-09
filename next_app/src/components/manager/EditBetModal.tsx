"use client";

import { Bet } from "@/store/betStore";
import { Socket } from "socket.io-client";
import { updateBetAction } from "@/lib/manager/managerBetActions";

type Props = {
  bet: Bet | null;
  socket: Socket | null;
  onClose: () => void;
  setBet: React.Dispatch<React.SetStateAction<Bet | null>>;
};

export default function EditBetModal({
  bet,
  socket,
  onClose,
  setBet,
}: Props) {
  if (!bet) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border rounded-xl p-6 w-full max-w-md space-y-4">

        <h2>Edit Bet</h2>

        <label>Bet</label>
        <input
          value={bet.question}
          onChange={(e) =>
            setBet({
              ...bet,
              question: e.target.value,
            })
          }
          className="w-full px-3 py-2 bg-zinc-800 rounded"
        />
        <label>Volume in $</label>
        <input
          type="number"
          value={bet.test_volume}
          onChange={(e) =>
            setBet({
              ...bet,
              test_volume: Number(e.target.value) || 0,
            })
          }
          className="w-full px-3 py-2 bg-zinc-800 rounded"
        />

        {bet.options.map((opt, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex-1">{opt.value}</span>

            <input
              type="number"
              value={opt.test_count}
              onChange={(e) => {
                const options = [...bet.options];
                options[i].test_count =
                  Number(e.target.value) || 0;

                const total = options.reduce(
                  (s, o) => s + o.test_count,
                  0
                );

                setBet({
                  ...bet,
                  options,
                  test_users: total,
                });
              }}
              className="w-24 px-3 py-2 bg-zinc-800 rounded"
            />
          </div>
        ))}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-zinc-700 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              updateBetAction(socket, bet);
              onClose();
            }}
            className="flex-1 py-2 bg-purple-600 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
