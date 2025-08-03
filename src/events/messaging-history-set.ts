import type { BaileysEventMap } from "baileys";
import { Store } from "../utils/store.ts";

export const MessagingHistorySet = async ({
  chats,
  contacts,
  messages,
}: BaileysEventMap["messaging-history.set"]) => {
  if (messages) {
    for (const message of messages) {
      await Store.save(message);
    }
  }
};
