"use client";

import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Bet } from "@/store/betStore";

import ManagerHeader from "@/components/manager/ManagerHeader";
import CreateBetPanel from "@/components/manager/CreateBetPanel";
import ManagerBetCard from "@/components/manager/ManagerBetCard";
import EditBetModal from "@/components/manager/EditBetModal";

import { useManagerBetsSocket } from "@/hooks/useManagerBetsSocket";

export default function AdminPage() {
  const socket = useSocket("admin");

  const [bets, setBets] = useState<Bet[]>([]);
  const [dataMode, setDataMode] = useState<"real" | "test">("real");

  const [editingBet, setEditingBet] = useState<Bet | null>(null);

  // create bet state
  const [question, setQuestion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [options, setOptions] = useState<string[]>([""]);

  /*
    SOCKET LISTENER HOOK
  */
    useManagerBetsSocket({
    socket,
    setBets,
  });

  return (
    <div className="h-screen flex flex-col text-white">

      {/* HEADER */}
      <ManagerHeader
        dataMode={dataMode}
        setDataMode={setDataMode}
      />

      {/* CREATE PANEL */}
      <CreateBetPanel
        socket={socket}
        question={question}
        setQuestion={setQuestion}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        options={options}
        setOptions={setOptions}
      />

      {/* BET LIST */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {bets.map((bet) => (
          <ManagerBetCard
            key={bet.id}
            bet={bet}
            dataMode={dataMode}
            socket={socket}
            onEdit={setEditingBet}
          />
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingBet && (
        <EditBetModal
          bet={editingBet}
          socket={socket}
          onClose={() => setEditingBet(null)}
          setBet={setEditingBet}
        />

      )}
    </div>
  );
}
