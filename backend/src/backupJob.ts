import cron from "node-cron";
import { redis } from "./redis";
import { prisma } from "./prisma";

export function startBackupJob() {
  cron.schedule("*/30 * * * *", async () => {
    console.log("Running bet backup...");

    const betIds = await redis.smembers("bets:active");

    for (const id of betIds) {
      const raw = await redis.get(`bet:${id}`);
      if (!raw) continue;

      const bet = JSON.parse(raw);

      await prisma.betBackup.upsert({
        where: { id: bet.id },
        update: {
          volume: bet.volume,
          users: bet.users,
          options: bet.options,
          correct_option: bet.correct_option,
          winners: bet.winners,
        },
        create: {
          ...bet,
          start_date: new Date(bet.start_date),
          end_date: new Date(bet.end_date),
          created_at: new Date(bet.created_at),
        },
      });
    }

    console.log("Backup complete");
  });
}
