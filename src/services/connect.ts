import { DisconnectReason } from "baileys";
import { Boom } from "@hapi/boom";
import startSock from "../socket.ts";
import { shutdown } from "../lib/utils/constants.ts";
import { Green, Red, Yellow } from "../lib/utils/console.ts";
import type { WASocket, ConnectionState } from "baileys";

export default async (sock: WASocket, update: Partial<ConnectionState>) => {
	const { connection, lastDisconnect } = update;

	if (connection === "close") {
		const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;

		const shouldRestart = [
			DisconnectReason.connectionLost,
			DisconnectReason.connectionClosed,
			DisconnectReason.connectionReplaced,
			DisconnectReason.restartRequired,
			DisconnectReason.badSession,
			DisconnectReason.loggedOut,
		];

		if (shouldRestart.includes(reason)) startSock();
		else {
			Red("Socket Error");
			shutdown();
		}
	}

	if (connection === "connecting") {
		Yellow("starting services...");
	}

	if (connection === "open") {
		Green("connection open!");
	}
};
