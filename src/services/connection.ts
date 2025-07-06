import { exit } from "node:process";
import sqlite from "../sqlite";
import { Boom } from "@hapi/boom";
import type { WASocket, BaileysEventMap, Contact } from "baileys";

export async function connection(
	ev: BaileysEventMap["connection.update"],
	sock: WASocket
) {
	const { connection, lastDisconnect } = ev;
	switch (connection) {
		case "connecting":
			console.log("connecting...");
			break;
		case "close":
			const error = lastDisconnect?.error as Boom;
			const reason = error?.output?.statusCode;

			if (reason === 401) sqlite.run("DELETE FROM auth"), exit();

			exit();
		case "open":
			const { id, lid } = sock.user as Contact;
			console.log("connection open.");
			break;
	}
}
