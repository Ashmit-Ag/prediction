import { create } from "zustand";

export type Option = {
  value: string;
  real_count: number;
  test_count: number;
};

export type Bet = {
  id: string;
  question: string;
  start_date: string;
  end_date: string;

  real_volume: number;
  test_volume: number;
  real_users: number;
  test_users: number;

  options: Option[];
};

type BetStore = {
  bets: Bet[];
  fetched: boolean;

  setBets: (
    bets: Bet[] | ((prev: Bet[]) => Bet[])
  ) => void;

  addBet: (bet: Bet) => void;
  updateBet: (bet: Bet) => void;
  clearBets: () => void;
};

export const useBetsStore = create<BetStore>((set) => ({
  bets: [],
  fetched: false,

  setBets: (bets) =>
    set((state) => ({
      bets:
        typeof bets === "function"
          ? bets(state.bets)
          : bets,
      fetched: true,
    })),

  addBet: (bet) =>
    set((state) => ({
      bets: [...state.bets, bet],
    })),

  updateBet: (updated) =>
    set((state) => ({
      bets: state.bets.map((b) =>
        b.id === updated.id ? updated : b
      ),
    })),

  clearBets: () =>
    set({
      bets: [],
      fetched: false,
    }),
}));
