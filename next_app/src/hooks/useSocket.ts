"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

export function useSocket(
  role: "admin" | "user",
  userId?: string
) {
  const [socket, setSocket] =
    useState<Socket | null>(null);

  useEffect(() => {
    if (role === "user" && !userId) return;

    const s = getSocket(role, userId);
    setSocket(s);
  }, [role, userId]);

  return socket;
}

