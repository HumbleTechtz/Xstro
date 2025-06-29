/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Controller for handling WhatsApp connection updates using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import { Boom } from "@hapi/boom";
import { DisconnectReason, jidNormalizedUser } from "baileys";
import { syncPlugins } from "../Core";
import { restart } from "../Utils";
import { SetSudo, auth, getBoot, setBoot } from "../Models";
import type { BaileysEventMap, WASocket } from "baileys";

export default class {
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
		const info = await syncPlugins("../../plugins", [".ts"]);
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

		resetReasons.includes(reason)
			? console.warn(`Disconnected: ${reason}`)
			: resetWithClearStateReasons.includes(reason)
			? (console.error(`Critical error: ${reason}`),
			  this.client.logout(),
			  auth().truncate(),
			  setBoot(true))
			: reason === DisconnectReason.restartRequired
			? setBoot(true)
			: console.error("Disconnected:", reason);

		restart();
	}

	private async handleOpen() {
		getBoot() && (setBoot(false), restart());

		SetSudo(
			jidNormalizedUser(this.client?.user?.id),
			jidNormalizedUser(this.client?.user?.lid)
		);

		console.info(
			this.client.user?.name
				? `Connected to ${this.client.user.name}`
				: `Bot Started`
		);
	}
}
