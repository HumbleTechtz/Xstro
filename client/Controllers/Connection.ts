/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Controller for handling WhatsApp connection updates using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import { Boom } from "@hapi/boom";
import { delay, DisconnectReason, jidNormalizedUser } from "baileys";
import config from "../../config";
import network from "../Core/network";
import { syncPlugins } from "../Core/";
import { restart } from "../Utils";
import { SetSudo, auth, getBoot, setBoot } from "../Models";
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
		await syncPlugins("../../plugins", [".ts"]);
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
			console.warn(`Disconnected: ${reason}`);
			restart();
		} else if (resetWithClearStateReasons.includes(reason)) {
			console.error(`Critical error: ${reason}`);
			await setBoot(true);
			auth().truncate();
			restart();
		} else if (reason === DisconnectReason.restartRequired) {
			await setBoot(true);
			restart();
		} else {
			console.error("Disconnected:", reason);
			await setBoot(true);
			auth().truncate();
			restart();
		}
	}

	private async handleOpen() {
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
		network(config.PORT);
		await SetSudo(
			jidNormalizedUser(this.client?.user?.id),
			jidNormalizedUser(this.client?.user?.lid)
		);

		console.info(`Connected to ${this.client.user?.name}`);
	}
}
