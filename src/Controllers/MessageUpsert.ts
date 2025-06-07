import { serialize } from "../Core/serialize.ts";
import handlers from "../Core/handlers.ts";
import { saveMsg } from "../Models/messages.ts";
import type { BaileysEventMap, WASocket } from "baileys";

export default class MessageUpsert {
	private client: WASocket;
	private data: BaileysEventMap["messages.upsert"];

	constructor(client: WASocket, upserts: BaileysEventMap["messages.upsert"]) {
		this.client = client;
		this.data = upserts;
	}

	async create(): Promise<void> {
		const msg = this.data.messages[0];
		const cloned = structuredClone(JSON.parse(JSON.stringify(msg)));
		const serialized = await serialize(this.client, cloned);
		await Promise.all([handlers(serialized), saveMsg(serialized)]);
	}
}
