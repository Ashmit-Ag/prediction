import { Socket } from "socket.io";

export function socketAuth(socket: Socket, next: any) {
  const role = socket.handshake.auth?.role;

  if (!role) {
    return next(new Error("Unauthorized"));
  }

  socket.data.role = role; // "admin" or "user"
  next();
}
