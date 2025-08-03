import { Boom } from "@hapi/boom";
import { DisconnectReason, type BaileysEventMap } from "baileys";
import { startSock } from "../client.ts";
import { syncPlugins } from "../utils/cmd-handler.ts";
import { logger } from "../utils/logger.ts";

export const ConnectionUpdate = async ({
  connection,
  lastDisconnect,
}: BaileysEventMap["connection.update"]) => {
  switch (connection) {
    case "open":
      logger.info("Connected WhatsApp.");
      await syncPlugins("../plugins", [".js", ".ts"]);
      break;
    case "close":
      const status = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const resetReasons = [
        DisconnectReason.restartRequired,
        DisconnectReason.connectionLost,
        DisconnectReason.connectionClosed,
        DisconnectReason.connectionLost,
      ];
      const fatalReasons = [
        DisconnectReason.badSession,
        DisconnectReason.loggedOut,
        DisconnectReason.multideviceMismatch,
      ];

      if (status && resetReasons.includes(status)) {
        startSock();
      } else if (status && fatalReasons.includes(status)) {
        process.exit();
      }
      break;
  }
};
