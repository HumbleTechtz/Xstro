import { Boom } from "@hapi/boom";
import { delay, DisconnectReason, jidNormalizedUser } from "baileys";
import { syncPlugins } from "../Core/plugin.ts";
import { SetSudo } from "../Models/Sudo.ts";
import { auth, sendStart } from "../Utils/index.ts";
import type { BaileysEventMap, WASocket } from "baileys";

export default class Connection {
	private client: WASocket;
	private events: BaileysEventMap["connection.update"];
	constructor(client: WASocket, events: BaileysEventMap["connection.update"]) {
		this.client = client;
		this.events = events;
		this.handleConnectionUpdate();
	}

	public async handleConnectionUpdate() {
		const { connection, lastDisconnect } = this.events;
		switch (connection) {
			case "connecting":
				await this.handleConnecting();
				break;
			case "close":
				await this.handleClose(lastDisconnect);
				break;
			case "open":
				await this.handleOpen();
				break;
		}
	}

	private async handleConnecting() {
		console.info("Connecting to WhatsApp...");
		await syncPlugins("../../plugins", [".ts", ".js", ".mjs"]);
		console.info("Plugins Synced");
	}

	private async handleClose(
		lastDisconnect?: BaileysEventMap["connection.update"]["lastDisconnect"],
	) {
		const error = lastDisconnect?.error as Boom;
		const reason = error?.output?.statusCode;

		const resetReasons = [
			DisconnectReason.connectionClosed,
			DisconnectReason.connectionLost,
			DisconnectReason.timedOut,
			DisconnectReason.connectionReplaced,
		];

		const resetWithClearStateReasons = [
			DisconnectReason.loggedOut,
			DisconnectReason.badSession,
		];

		if (resetReasons.includes(reason)) {
			console.warn(`Disconnected: ${reason} — restarting`);
			exit();
		} else if (resetWithClearStateReasons.includes(reason)) {
			console.error(`Critical error: ${reason} — clearing state and exiting`);
			await auth.truncate();
			exit();
		} else if (reason === DisconnectReason.restartRequired) {
			console.info("Restart required — exiting to allow restart");
			process.exit(0);
		} else {
			console.error("Unexpected disconnect reason:", reason);
			await auth.truncate();
			exit();
		}
	}

	private async handleOpen() {
		console.info("Connected to WhatsApp");
		await sendStart(this.client);
		await delay(5000);
		await SetSudo(
			jidNormalizedUser(this.client?.user?.id),
			jidNormalizedUser(this.client?.user?.lid),
		);
	}
}

function exit() {
	return process.exit();
}
