"use client";

import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { normalizeBet } from "@/store/helper";
import { useBetsStore } from "@/store/betStore";

type Props = {
  socket: Socket | null;
  userId?: string;
  setSelectedOptionMap: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
};

export function useUserBetsSocket({
  socket,
  userId,
  setSelectedOptionMap,
}: Props) {
  const setBets = useBetsStore((s) => s.setBets);
  const addBet = useBetsStore((s) => s.addBet);
  const updateBet = useBetsStore((s) => s.updateBet);

  useEffect(() => {
    if (!socket || !userId) return;

    /* INIT BETS */
    socket.on("bets:init", (bets) => {
      const normalized = bets.map(normalizeBet);
      setBets(normalized);

      // restore selected bets from server
      const map: Record<string, string> = {};
      normalized.forEach((b: any) => {
        if (b.userVote?.option) {
          map[b.id] = b.userVote.option;
        }
      });

      setSelectedOptionMap(map);
    });

    /* NEW BET */
    socket.on("bet:new", (bet) => {
      addBet(normalizeBet(bet));
    });

    /* BET UPDATE */
    socket.on("bet:update", (bet) => {
      const normalized = normalizeBet(bet);
      updateBet(normalized);

      // IMPORTANT:
      // Don't overwrite selection unless server sends userVote
      if ((bet as any).userVote?.option) {
        setSelectedOptionMap((prev) => ({
          ...prev,
          [bet.id]: (bet as any).userVote.option,
        }));
      }
    });

    return () => {
      socket.off("bets:init");
      socket.off("bet:new");
      socket.off("bet:update");
    };
  }, [
    socket,
    userId,
    setBets,
    addBet,
    updateBet,
    setSelectedOptionMap,
  ]);
}
