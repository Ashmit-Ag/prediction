import { Server } from "socket.io";
import { redis } from "./redis";

export function initSocket(io: Server) {
  io.use((socket, next) => {
    const role = socket.handshake.auth.role;
    socket.data.role = role;
    console.log("🔐 Socket auth role:", role);
    next();
  });

  io.on("connection", async (socket) => {
    console.log("🟢 Connected:", socket.id, "| Role:", socket.data.role);

    /* ================= INIT BETS ================= */
    try {
      const ids = await redis.smembers("bets:active");

      const bets = [];
      for (const id of ids) {
        const bet = await redis.get(`bet:${id}`);
        if (bet) bets.push(JSON.parse(bet));
      }

      const userId = socket.handshake.auth.userId;

      const enrichedBets = bets.map(bet => {
        const vote = bet.votes?.[userId];
        return {
          ...bet,
          userVote: vote || null,
        };
      });


      console.log("📤 Sending initial bets:", bets.length);
      socket.emit("bets:init", enrichedBets);
    } catch (err) {
      console.error("❌ Error loading bets:", err);
    }

    /* ================= CREATE BET ================= */
    socket.on("bet:create", async (bet) => {
      if (socket.data.role !== "admin") {
        console.warn("🚫 Non-admin tried to create bet");
        return;
      }

      try {
        bet.votes = {};

        await redis.set(`bet:${bet.id}`, JSON.stringify(bet));
        await redis.sadd("bets:active", bet.id);

        console.log("✅ Bet created:", bet.id, bet.question);

        io.emit("bet:new", bet);
      } catch (err) {
        console.error("❌ Bet creation failed:", err);
      }
    });

    /* ================= USER VOTE ================= */
    socket.on("bet:place", async ({ betId, option, amount }) => {
      try {
        const userId = socket.handshake.auth.userId;
    
        console.log("🧾 Vote attempt:", {
          betId,
          option,
          amount,
          userId,
        });
    
        if (!userId) {
          console.warn("❌ Missing userId in socket auth");
          return;
        }
    
        const raw = await redis.get(`bet:${betId}`);
        if (!raw) return;
    
        const bet = JSON.parse(raw);
    
        if (!bet.votes) bet.votes = {};
    
        // prevent duplicate vote
        if (bet.votes[userId]) {
          console.warn("⚠️ Duplicate vote blocked:", userId);
          return;
        }
    
        bet.votes[userId] = { option, amount };
    
        // safer totals
        bet.real_users = Object.keys(bet.votes).length;
        bet.real_volume = Object.values(bet.votes)
          .reduce((s, v:any) => s + v.amount, 0);
    
        bet.options.forEach((opt:any) => {
          opt.real_count = Object.values(bet.votes)
            .filter((v:any) => v.option === opt.value)
            .length;
        });
    
        await redis.set(`bet:${betId}`, JSON.stringify(bet));
    
        io.emit("bet:update", bet);
    
      } catch (err) {
        console.error("❌ Vote error:", err);
      }
    });
    
    /* ================= REFUND BET ================= */
    socket.on("bet:refund", async ({ betId }) => {
      try {
        const userId = socket.handshake.auth.userId;
    
        console.log("💸 Refund attempt:", { betId, userId });
    
        if (!userId) return;
    
        const raw = await redis.get(`bet:${betId}`);
        if (!raw) return;
    
        const bet = JSON.parse(raw);
    
        if (!bet.votes?.[userId]) {
          console.warn("⚠️ No vote found");
          return;
        }
    
        delete bet.votes[userId];
    
        // recompute totals
        bet.real_users = Object.keys(bet.votes).length;
        bet.real_volume = Object.values(bet.votes)
          .reduce((s, v:any) => s + v.amount, 0);
    
        bet.options.forEach((opt:any) => {
          opt.real_count = Object.values(bet.votes)
            .filter((v:any) => v.option === opt.value)
            .length;
        });
    
        await redis.set(`bet:${betId}`, JSON.stringify(bet));
    
        console.log("✅ Refund processed:", betId);
    
        io.emit("bet:update", bet);
    
      } catch (err) {
        console.error("❌ Refund error:", err);
      }
    });
    


    /* ================= ADMIN UPDATE ================= */
    socket.on("bet:update:admin", async (incoming) => {
      if (socket.data.role !== "admin") {
        console.warn("🚫 Non-admin update attempt");
        return;
      }

      try {
        const raw = await redis.get(`bet:${incoming.id}`);
        if (!raw) {
          console.warn("⚠️ Bet not found for admin update");
          return;
        }

        const existing = JSON.parse(raw);

        const calculatedTestUsers =
          incoming.options?.reduce(
            (sum: number, o: any) => sum + (o.test_count || 0),
            0
          ) || existing.test_users;


        const merged = {
          ...existing,
          test_volume: incoming.test_volume,
          test_users: calculatedTestUsers,
          options: existing.options.map((opt: any, i: number) => ({
            ...opt,
            test_count:
              incoming.options?.[i]?.test_count ?? opt.test_count,
          })),
        };

        await redis.set(`bet:${merged.id}`, JSON.stringify(merged));

        console.log("🛠 Admin updated bet:", merged.id, {
          test_volume: merged.test_volume,
          test_users: merged.test_users,
        });

        io.emit("bet:update", merged);
      } catch (err) {
        console.error("❌ Admin update error:", err);
      }
    });

    /* ================= DELETE BET ================= */
    socket.on("bet:delete", async (betId) => {
      if (socket.data.role !== "admin") {
        console.warn("🚫 Non-admin delete attempt");
        return;
      }

      try {
        await redis.del(`bet:${betId}`);
        await redis.srem("bets:active", betId);

        console.log("🗑 Bet deleted:", betId);

        io.emit("bet:delete", betId);
      } catch (err) {
        console.error("❌ Delete error:", err);
      }
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
}
