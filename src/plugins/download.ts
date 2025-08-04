import { extractUrlFromText } from "baileys";
import type { CommandModule } from "../types/Command.ts";

export default [
  {
    pattern: "twitter",
    aliases: ["x"],
    fromMe: false,
    isGroup: false,
    desc: "Download Twitter/X videos",
    type: "download",
    execute: async (msg, args) => {
      const url = extractUrlFromText(args ?? msg?.quoted?.text ?? "");
      if (
        !url ||
        !/^https?:\/\/(?:www\.)?(twitter\.com|x\.com)\/[^\/\s]+\/status\/\d+/i.test(
          url,
        )
      ) {
        return msg.reply("Provide a valid Twitter/X link!");
      }

      const res = (await fetch("https://xstroapi.vercel.app", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ url }),
      })
        .then((res) => res.json())
        .then((res) => res)) as { url: string };

      return await msg.client.sendMessage(msg.from, {
        video: { url: res.url },
      });
    },
  },
] satisfies CommandModule[];
