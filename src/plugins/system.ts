import type { CommandModule } from "../types/Command.ts";

export default [
  {
    pattern: "runtime",
    aliases: ["uptime"],
    fromMe: false,
    isGroup: false,
    desc: "Get runtime",
    type: "system",
    execute: async (msg) => {},
  },
  {
    pattern: "ping",
    fromMe: false,
    isGroup: false,
    desc: "Ping the bot",
    type: "system",
    execute: async (msg) => {
      const start = Date.now();
      const m = await msg.reply("Pong!");
      const end = Date.now();
      return await m.edit(`\`\`\`${end - start} ms\`\`\``);
    },
  },
] satisfies CommandModule[];
