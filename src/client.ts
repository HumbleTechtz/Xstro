import makeWASocket, { delay } from "baileys";
import { Boom } from "@hapi/boom";
import * as P from "pino";
import config from "../config.ts";
import { useSqliteAuthState } from "./utils/auth.ts";
import {
	handleConnectionUpdate,
	handleMessagesUpsert,
	handleMessagesUpdate,
	handleMessagingHistorySet,
	handleGroupsUpdate,
	handleGroupsUpsert,
	handleGroupParticipantsUpdate,
	handleCall,
	handlePresenceUpdate,
} from "./events/index.ts";

const logger = P.pino({ level: "silent" });

export const startSock = async () => {
	const { state, saveCreds } = await useSqliteAuthState();

	const sock = makeWASocket({
		auth: state,
		logger,
	});

	if (!sock.authState.creds.registered) {
		await delay(3000);
		const code = await sock.requestPairingCode(config.NUMBER, config.PAIR_CODE);
		console.log(`Connect with: ${code}`);
	}

	sock.ev.on("creds.update", () => saveCreds());
	sock.ev.on("connection.update", handleConnectionUpdate);
	sock.ev.on("messages.upsert", handleMessagesUpsert(sock));
	sock.ev.on("messages.update", handleMessagesUpdate);
	sock.ev.on("messaging-history.set", handleMessagingHistorySet);
	sock.ev.on("groups.update", handleGroupsUpdate);
	sock.ev.on("groups.upsert", handleGroupsUpsert);
	sock.ev.on("group-participants.update", handleGroupParticipantsUpdate);
	sock.ev.on("call", handleCall);
	sock.ev.on("presence.update", handlePresenceUpdate);

	return sock;
};

startSock();
