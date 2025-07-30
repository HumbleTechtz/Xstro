import { Boom } from "@hapi/boom";
import { DisconnectReason, type BaileysEventMap } from "baileys";
import { startSock } from "../client.ts";

export const handleConnectionUpdate = async ({
	connection,
	lastDisconnect,
}: BaileysEventMap["connection.update"]) => {
	switch (connection) {
		case "open":
			console.log("opened connection");
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
		default:
			break;
	}
};
