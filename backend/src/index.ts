import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import { initSocket } from "./socket";
import { socketAuth } from "./auth";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(socketAuth);

initSocket(io);

app.get("/", (_, res) => {
  res.send("Bet socket server running");
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
