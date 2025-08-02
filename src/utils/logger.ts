import type { Message } from "../class/index.ts";

export const logger = async (msg: Message) => {
  return console.log(
    `
Name: ${msg.pushName || "Maybe Baileys Bot"}
Message: ${msg.mtype || "No message from Node"}
isSudo: ${msg.sudo ? "Yes" : "No"}
FromGroup: ${msg.isGroup ? "Yes" : "No"}
`.trim(),
  );
};
