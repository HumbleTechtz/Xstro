import type { CommandModule } from "../types/Command.ts";
import { logger } from "../utils/logger.ts";
import { getJson } from "../utils/netutils.ts";

export default [
  {
    pattern: "vox",
    fromMe: false,
    isGroup: false,
    desc: "Vox news",
    type: "news",
    execute: async (msg) => {
      try {
        const news = await getJson("https://astro-api.koyeb.app/vox");

        if (!Array.isArray(news) || news.length === 0) {
          return await msg.reply("no news found.");
        }

        const selected = news.slice(0, 5);
        const formatted = selected
          .map((item, i) => `${i + 1}. ${item.title}\n${item.url}`)
          .join("\n\n");

        await msg.reply(`📰 *Vox News:*\n\n${formatted}`);
      } catch (err) {
        logger.error(err);
        await msg.reply("failed to fetch news.");
      }
    },
  },
] satisfies CommandModule[];
