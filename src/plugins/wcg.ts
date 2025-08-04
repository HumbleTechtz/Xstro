import type { Message } from "../class/index.ts";
import type { CommandModule } from "../types/Command.ts";
import { WcgGame } from "./class/Wcg.ts";

const players = new Map<string, boolean>();
const chatId = new Map<string, boolean>();
const scores = new Map<string, string>();
let isActive = false;
let gameStarted = false;

export default [
  {
    pattern: "wcg",
    fromMe: false,
    isGroup: true,
    desc: "Play Word Chain Game",
    type: "games",
    execute: async (msg) => {
      const active = chatId.get(msg.from);
      if (active) return msg.reply("```Game already running for this chat.```");
      chatId.set(msg.from, true);
      players.clear();
      scores.clear();
      isActive = false;
      gameStarted = false;
      await msg.reply('```Word Chain Game Started!\nType "join" to join.```');
      countdown(msg);
    },
  },
  {
    on: "wcg",
    execute: async (msg) => {
      if (msg.isGroup && msg.text) {
        const text = msg.text.trim().toLowerCase();
        const sender = msg.sender;

        if (/^[a-zA-Z\s]+$/.test(text)) {
          if (text === "join" && !isActive) {
            if (players.has(sender)) return;
            players.set(sender, true);
            await msg.client.sendMessage(msg.from, {
              text: `\`\`\`@${sender.split("@")[0]} has joined the game\`\`\``,
              mentions: [sender],
            });
          }

          if (isActive && !gameStarted) {
            gameStarted = true;
            new WcgGame(msg, players, chatId, scores);
          }
        }
      }
    },
  },
] satisfies CommandModule[];

function countdown(message: Message) {
  isActive = false;
  const checkpoints = [20, 10, 0];
  let index = 0;

  const tick = async () => {
    const timeLeft = checkpoints[index];

    if (timeLeft > 0) {
      await message.reply(`\`\`\`${timeLeft} seconds left.\`\`\``);
    } else {
      await message.reply("```Game started!```");
      isActive = true;
      return;
    }

    index++;
    setTimeout(tick, 10_000);
  };

  tick();
}
