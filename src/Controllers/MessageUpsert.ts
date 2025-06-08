import handlers from "../Core/handlers.ts";
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
		const event = this.event;
		await Promise.all([save_message(event), this.hookMessages(event.messages)]);
	}

	private async hookMessages(
		messages: BaileysEventMap["messages.upsert"]["messages"],
	) {
		for (const message of messages) {
			await handlers(
				await serialize(
					this.client,
					structuredClone(JSON.parse(JSON.stringify(message))),
				),
			);
		}
	}
}
