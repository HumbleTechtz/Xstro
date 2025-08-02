import type { BaileysEventMap, WASocket } from "baileys";
import { Message } from "../class/index.ts";
import { Store } from "../utils/store.ts";

export const MessagesUpsert = (sock: WASocket) => {
  return async ({ messages, type }: BaileysEventMap["messages.upsert"]) => {
    if (type !== "notify") return;
    const message = messages[0];
    const msg = new Message(sock, JSON.parse(JSON.stringify(message)));

    await Promise.allSettled([Store.save(message)]);
  };
};
