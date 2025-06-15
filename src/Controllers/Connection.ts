import { Boom } from "@hapi/boom";
import { delay, DisconnectReason, jidNormalizedUser } from "baileys";
import { syncPlugins } from "../Core/plugin.ts";
import { SetSudo } from "../Models/Sudo.ts";
import { truncate, sendStart, restart } from "../Utils/index.ts";
import { getBoot, setBoot } from "../Models/Boot.ts";
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
		lastDisconnect?: BaileysEventMap["connection.update"]["lastDisconnect"]
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
			restart();
		} else if (resetWithClearStateReasons.includes(reason)) {
			console.error(`Critical error: ${reason} — clearing state and exiting`);
			await setBoot(true);
			await truncate();
			restart();
		} else if (reason === DisconnectReason.restartRequired) {
			console.info("Restart required — exiting to allow restart");
			await setBoot(true);
			restart();
		} else {
			console.error("Unexpected disconnect reason:", reason);
			await setBoot(true);
			await truncate();
			restart();
		}
	}

	private async handleOpen() {
		console.info("Connected to WhatsApp");
		const isNewLogin = await getBoot();
		await delay(2500);
		if (isNewLogin) {
			try {
				await setBoot(false);
				restart();
			} catch {
				restart();
			}
		}
		await sendStart(this.client);
		await SetSudo(
			jidNormalizedUser(this.client?.user?.id),
			jidNormalizedUser(this.client?.user?.lid)
		);
	}
}
