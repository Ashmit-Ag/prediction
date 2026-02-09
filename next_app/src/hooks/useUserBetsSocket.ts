"use client";

import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { normalizeBet } from "@/store/helper";
import { useBetsStore } from "@/store/betStore";

type UserBet = {
  option: string;
  amount: number;
};

type Props = {
  socket: Socket | null;
  userId?: string;
  setSelectedOptionMap: React.Dispatch<
    React.SetStateAction<Record<string, UserBet>>
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

    /* ================= INIT BETS ================= */
    socket.on("bets:init", (bets) => {
      const normalized = bets.map(normalizeBet);
      setBets(normalized);

      const map: Record<string, UserBet> = {};

      normalized.forEach((b: any) => {
        if (b.userVote?.option) {
          map[b.id] = {
            option: b.userVote.option,
            amount: b.userVote.amount ?? 0,
          };
        }
      });

      setSelectedOptionMap(map);
    });

    /* ================= NEW BET ================= */
    socket.on("bet:new", (bet) => {
      addBet(normalizeBet(bet));
    });

    /* ================= UPDATE BET ================= */
    socket.on("bet:update", (bet) => {
      const normalized = normalizeBet(bet);
      updateBet(normalized);

      // Only update user bet if server sends it
      if ((bet as any).userVote?.option) {
        setSelectedOptionMap((prev) => ({
          ...prev,
          [bet.id]: {
            option: bet.userVote.option,
            amount: bet.userVote.amount ?? 0,
          },
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
