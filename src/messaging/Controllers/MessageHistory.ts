import { isJidUser, isLidUser, type BaileysEventMap } from 'baileys';
import { ChatsDb } from '../../models/chats.ts';
import { contactsDb } from '../../models/contact.ts';
import { messageDb } from '../../models/messages.ts';

export default class MessageHistory {
	private update: BaileysEventMap['messaging-history.set'];
	constructor(update: BaileysEventMap['messaging-history.set']) {
		this.update = update;
	}
	async create() {
		const { chats, contacts, messages, progress } = this.update;

		if (progress) {
			console.log(`Sync Progress`, progress);
		}

		if (chats) {
			for (const chat of chats) {
				await ChatsDb.create({
					data: chat ?? null,
				});
			}
		}

		if (contacts) {
			for (const contact of contacts) {
				if (!isJidUser(contact?.id) || !isLidUser(contact?.lid)) return;
				await contactsDb.create({ ...contact });
			}
		}

		if (messages) {
			for (const message of messages) {
				await messageDb.create({
					id: message.key.id,
					messages: message,
					type: message.messageStubType,
					requestId: null,
				});
			}
		}
	}
}
