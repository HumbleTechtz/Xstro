import makeWASocket, { delay, type CacheStore } from "baileys";
import * as P from "pino";
import Cache from "@cacheable/node-cache";
import config from "../config.ts";
import { useSqliteAuthState } from "./utils/auth.ts";
import {
  ConnectionUpdate,
  MessagesUpsert,
  MessagesUpdate,
  MessagingHistorySet,
  GroupsUpdate,
  GroupsUpsert,
  GroupParticipantsUpdate,
  Call,
  PresenceUpdate,
} from "./events/index.ts";
import { GroupCache } from "./utils/schemas/metadata.ts";
import { makeSocketCache } from "./events/hooks/caches.ts";

const msgRetryCounterCache = new Cache() as CacheStore;
const logger = P.pino({ level: "silent" });

export const startSock = async () => {
  const { state, saveCreds } = await useSqliteAuthState();

  const sock = makeWASocket({
    auth: state,
    logger,
    msgRetryCounterCache,
    cachedGroupMetadata: async (jid) => {
      return await GroupCache.get.one(jid);
    },
  });

  if (!sock.authState.creds.registered) {
    await delay(3000);
    const code = await sock.requestPairingCode(config.NUMBER, config.PAIR_CODE);
    console.log(`Connect with: ${code}`);
  }

  sock.ev.on("creds.update", () => saveCreds());
  sock.ev.on("connection.update", ConnectionUpdate);
  sock.ev.on("messages.upsert", MessagesUpsert(sock));
  sock.ev.on("messages.update", MessagesUpdate);
  sock.ev.on("messaging-history.set", MessagingHistorySet);
  sock.ev.on("groups.update", GroupsUpdate);
  sock.ev.on("groups.upsert", GroupsUpsert);
  sock.ev.on("group-participants.update", GroupParticipantsUpdate);
  sock.ev.on("call", Call);
  sock.ev.on("presence.update", PresenceUpdate);

  makeSocketCache(sock);
  return sock;
};

startSock();
