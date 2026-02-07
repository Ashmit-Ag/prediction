import { useEffect, useRef } from "react";
import { createBetAction } from "@/lib/manager/managerBetActions";

export default function CreateBetPanel({
  socket,
  question,
  setQuestion,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  options,
  setOptions,
}: any) {
  const optionRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusIndexRef = useRef<number | null>(null);

  const addOption = () => {
    focusIndexRef.current = options.length;
    setOptions((prev: string[]) => [...prev, ""]);
  };

  // focus AFTER render
  useEffect(() => {
    if (focusIndexRef.current !== null) {
      optionRefs.current[focusIndexRef.current]?.focus();
      focusIndexRef.current = null;
    }
  }, [options]);

  return (
    <div className="p-6 border-b border-zinc-800 bg-zinc-900 space-y-4">
      <h2 className="text-lg font-semibold">
        Create New Bet
      </h2>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Bet question"
        className="w-full px-4 py-2 rounded bg-zinc-800"
      />

      <div className="flex gap-4">
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-zinc-800"
        />

        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-zinc-800"
        />
      </div>

      {options.map((opt: string, i: number) => (
        <input
          key={i}
          ref={(el) => {
            optionRefs.current[i] = el;
          }}
          value={opt}
          onChange={(e) => {
            const copy = [...options];
            copy[i] = e.target.value;
            setOptions(copy);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addOption();
            }
          }}
          placeholder={`Option ${i + 1}`}
          className="w-full px-3 py-2 rounded bg-zinc-800"
        />
      ))}

      <button
        onClick={addOption}
        className="bg-zinc-700 px-4 py-1 rounded"
      >
        Add Option
      </button>

      <button
        onClick={() => {
          createBetAction(
            socket,
            question,
            startDate,
            endDate,
            options
          );

          // clear form
          setQuestion("");
          setStartDate("");
          setEndDate("");
          setOptions([""]);
        }}
        className="w-full py-2 bg-purple-600 rounded"
      >
        Create Bet
      </button>

    </div>
  );
}
