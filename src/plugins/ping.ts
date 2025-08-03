import type { CommandModule } from "../types/Command.ts";

export default {
  pattern: "ping",
  fromMe: false,
  isGroup: false,
  desc: "Ping the bot",
  type: "system",
  execute: async (message) => {
    const start = Date.now();
    const msg = await message.reply("Pong!");
    const end = Date.now();
    return await msg.edit(`\`\`\`${end - start} ms\`\`\``);
  },
} satisfies CommandModule;
