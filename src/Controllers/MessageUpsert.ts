/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Controller for handling WhatsApp message upserts using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import makeCommands from "../Core/handlers.ts";
import { serialize } from "../Core/serialize.ts";
import { save_message } from "../Models/Messages.ts";
import type { BaileysEventMap, WASocket } from "baileys";

export default class MessageUpsert {
	client: WASocket;
	event: BaileysEventMap["messages.upsert"];

	constructor(client: WASocket, upserts: BaileysEventMap["messages.upsert"]) {
		this.client = client;
		this.event = upserts;
		this.upsert();
	}

	private async upsert() {
		const { messages } = this.event;
		await Promise.allSettled([
			save_message(this.event),
			this.hookMessages(messages),
		]);
	}

	private async hookMessages(
		messages: BaileysEventMap["messages.upsert"]["messages"]
	) {
		const messagePromises = messages.map(async message => {
			if (
				message.message?.protocolMessage &&
				message.message.protocolMessage.type === 0
			) {
				const { key } = message["message"].protocolMessage;
				this.client.ev.emit("messages.delete", { keys: [{ ...key }] });
			}
			const serialized = await serialize(this.client, structuredClone(message));
			return makeCommands(serialized);
		});

		await Promise.allSettled(messagePromises);
	}
}
