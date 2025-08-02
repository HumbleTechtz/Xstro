import type { BaileysEventMap, WASocket } from "baileys";
import { Message } from "../class/index.ts";
import { Store } from "../utils/store.ts";
import { runCommands } from "../utils/cmd-runner.ts";
import { logger } from "../utils/logger.ts";

export const MessagesUpsert = (sock: WASocket) => {
  return async ({ messages, type }: BaileysEventMap["messages.upsert"]) => {
    if (type !== "notify") return;
    const message = messages[0];

    const { Settings } = await import("../utils/schemas/settings.ts");

    const prefix = await Settings.get.prefix();
    const mode = await Settings.get.mode();

    const msg = new Message(sock, {
      ...JSON.parse(JSON.stringify(message)),
      prefix,
      mode,
    });
    await Promise.allSettled([
      Store.save(message),
      runCommands(msg),
      logger(msg),
    ]);
  };
};
