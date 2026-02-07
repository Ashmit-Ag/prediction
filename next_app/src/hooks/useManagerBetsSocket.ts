"use client";

import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { normalizeBet } from "@/store/helper";
import { Bet } from "@/store/betStore";

type Props = {
  socket: Socket | null;
  setBets: React.Dispatch<React.SetStateAction<Bet[]>>;
};

export function useManagerBetsSocket({
  socket,
  setBets,
}: Props) {
  useEffect(() => {
    if (!socket) return;

    /* INIT */
    socket.on("bets:init", (data: Bet[]) => {
      setBets(data.map(normalizeBet));
    });

    /* NEW BET */
    socket.on("bet:new", (bet: Bet) => {
      setBets(prev => [...prev, normalizeBet(bet)]);
    });

    /* UPDATE BET */
    socket.on("bet:update", (bet: Bet) => {
      const normalized = normalizeBet(bet);

      setBets(prev =>
        prev.map(b =>
          b.id === normalized.id ? normalized : b
        )
      );
    });

    /* DELETE BET */
    socket.on("bet:delete", (id: string) => {
      setBets(prev =>
        prev.filter(b => b.id !== id)
      );
    });

    return () => {
      socket.off("bets:init");
      socket.off("bet:new");
      socket.off("bet:update");
      socket.off("bet:delete");
    };
  }, [socket, setBets]);
}
