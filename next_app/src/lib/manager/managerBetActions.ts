import { Socket } from "socket.io-client";
import { Bet } from "@/store/betStore";

export const createBetAction = (
  socket: Socket | null,
  question: string,
  startDate: string,
  endDate: string,
  options: string[]
) => {
  if (!socket || !question || !startDate || !endDate) return;

  const bet: Bet = {
    id: Date.now().toString(),
    question,
    start_date: new Date(startDate).toISOString(),
    end_date: new Date(endDate).toISOString(),
    real_volume: 0,
    real_users: 0,
    test_volume: 0,
    test_users: 0,
    options: options
      .filter(Boolean)
      .map((o) => ({
        value: o,
        real_count: 0,
        test_count: 0,
      })),
  };

  socket.emit("bet:create", bet);
};

export const updateBetAction = (
  socket: Socket | null,
  bet: Bet
) => {
  socket?.emit("bet:update:admin", bet);
};

export const deleteBetAction = (
  socket: Socket | null,
  id: string
) => {
  socket?.emit("bet:delete", id);
};
