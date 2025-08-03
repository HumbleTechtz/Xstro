import type { Chat, Contact, WAMessage } from "baileys";
import { Store } from "../utils/store.ts";

export const MessagingHistorySet = async ({
  chats,
  contacts,
  messages,
}: {
  chats: Chat[];
  contacts: Contact[];
  messages: WAMessage[];
}) => {
  if (messages) {
    for (const message of messages) {
      await Store.save(message);
    }
  }
};
