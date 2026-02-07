"use client";

import { io, Socket } from "socket.io-client";

const sockets: Record<string, Socket> = {};

export const getSocket = (
  role: "admin" | "user",
  userId?: string
) => {
  const key = `${role}-${userId ?? "anon"}`;

  if (!sockets[key]) {
    sockets[key] = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: {
        role,
        userId,
      },
      transports: ["websocket"],
    });
  }

  return sockets[key];
};
