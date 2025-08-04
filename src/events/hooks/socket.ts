import type { WASocket } from "baileys";
import { CronJob } from "cron";
import { GroupCache } from "../../utils/schemas/metadata.ts";
import { logger } from "../../utils/logger.ts";

export const makeSocketCache = async (client: WASocket) => {
  const job = new CronJob("*/5 * * * *", async () => {
    try {
      const groups = await client.groupFetchAllParticipating();

      for (const [jid, metadata] of Object.entries(groups)) {
        await GroupCache.set.update(jid, metadata);
      }
    } catch (err) {
      logger.error("[GroupCache] Error updating metadata:", err);
    }
  });

  job.start();
};
