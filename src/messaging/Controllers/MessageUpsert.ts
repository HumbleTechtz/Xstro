import Message from '../Messages/Message.ts';
import { serialize } from '../serialize.ts';
import handlers from '../handlers.ts';
import { messageDb } from '../../models/messages.ts';
import type { BaileysEventMap, WASocket } from 'baileys';

export default class MessageUpsert {
	private client: WASocket;
	private data: BaileysEventMap['messages.upsert'];

	constructor(client: WASocket, upserts: BaileysEventMap['messages.upsert']) {
		this.client = client;
		this.data = upserts;
	}

	/** Process upserted messages */
	async create(): Promise<void> {
		const msg = this.data.messages[0];
		const cloned = structuredClone(JSON.parse(JSON.stringify(msg)));
		const serialized = await serialize(this.client, cloned);
		const instance = new Message(serialized, this.client);
		await Promise.all([
			handlers(instance),
			messageDb.create({
				id: msg.key?.id,
				messages: msg,
				type: this.data?.type,
				requestId: this.data?.requestId,
			}),
		]);
	}
}
