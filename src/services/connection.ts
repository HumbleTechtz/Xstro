import { Boom } from "@hapi/boom";
import { sqlite, Green, Yellow } from "..";
import type { BaileysEventMap } from "baileys";

export default async (ev: BaileysEventMap["connection.update"]) => {
	const { connection, lastDisconnect } = ev;

	switch (connection) {
		case "connecting":
			Yellow("connecting...");
			break;
		case "close":
			const error = lastDisconnect?.error as Boom;
			const reason = error?.output?.statusCode;

			if (reason === 401) sqlite.run("DELETE FROM auth"), process.exit();

			process.exit();
		case "open":
			Green("connection open.");
			break;
	}
};
