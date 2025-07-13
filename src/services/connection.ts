import { exit } from "node:process";
import { sqlite } from "../sqlite";
import { Boom } from "@hapi/boom";
import { Green, Yellow } from "lib";
import type { WASocket, BaileysEventMap, Contact } from "baileys";

export default async (
	ev: BaileysEventMap["connection.update"],
	sock: WASocket
) => {
	const { connection, lastDisconnect } = ev;
	switch (connection) {
		case "connecting":
			Yellow("connecting...");
			break;
		case "close":
			const error = lastDisconnect?.error as Boom;
			const reason = error?.output?.statusCode;

			if (reason === 401) sqlite.run("DELETE FROM auth"), exit();

			exit();
		case "open":
			Green("connection open.");
			break;
	}
};
