import { create } from "zustand";

type Option = {
  value: string;
  user_count: number;
};

export type Bet = {
  id: string;
  question: string;
  volume: number;
  users: number;
  options: Option[];
};

type BetsState = {
  bets: Bet[];
  fetched: boolean;
  setBets: (bets: Bet[]) => void;
  updateBet: (bet: Bet) => void;
};

export const useBetsStore = create<BetsState>((set) => ({
  bets: [],
  fetched: false,

  setBets: (bets) =>
    set({
      bets,
      fetched: true,
    }),

  updateBet: (updated) =>
    set((state) => ({
      bets: state.bets.map((b) =>
        b.id === updated.id ? updated : b
      ),
    })),
}));
