import Message from '../Messages/Message.ts';
import { serialize } from '../../serialize.ts';
import { BufferJSON, type BaileysEventMap, type WASocket } from 'baileys';
import { preserveMessage } from '../../../models/store.ts';
import handlers from '../../handlers.ts';

export default class MessageUpsert {
	private client: WASocket;
	private msg: BaileysEventMap['messages.upsert'];

	constructor(client: WASocket, upserts: BaileysEventMap['messages.upsert']) {
		this.client = client;
		this.msg = upserts;
		this.msgHooks();
	}

	private async msgHooks(): Promise<void> {
		for (const msg of this.msg.messages) {
			if (msg?.messageStubParameters?.[0] === 'Message absent from node') {
				await this.client.sendMessageAck(
					JSON.parse(
						JSON.stringify(msg?.messageStubParameters?.[1]),
						BufferJSON.reviver,
					),
				);
			}
			const cloned = structuredClone(msg);
			const serialized = await serialize(this.client, cloned);
			const instance = new Message(serialized, this.client);

			await Promise.all([handlers(instance), preserveMessage(msg)]);
		}
	}
}
