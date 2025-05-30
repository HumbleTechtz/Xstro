import {
	isJidUser,
	isLidUser,
	type WASocket,
	type BaileysEventMap,
} from "baileys";
import { ChatsDb } from "../../models/chats.ts";
import { contactsDb } from "../../models/contact.ts";
import { messageDb } from "../../models/messages.ts";

export default class MessageHistory {
	private update: BaileysEventMap["messaging-history.set"];
	constructor(
		update: BaileysEventMap["messaging-history.set"],
		client?: WASocket,
	) {
		this.update = update;
	}
	async create() {
		const { chats, contacts, messages } = this.update;

		if (chats) {
			for (const chat of chats) {
				await ChatsDb.create({
					data: chat ?? null,
				});
			}
		}

		if (contacts) {
			for (const contact of contacts) {
				if (!isJidUser(contact?.id) && !isLidUser(contact?.lid)) return;
				const exists = await contactsDb.findOne({ where: { id: contact.id } })
				if (exists) {
					await contactsDb.update({ ...contact }, { where: { id: contact.id } })
				} else {
					await contactsDb.create({ ...contact })
				}
			}
		}

		if (messages) {
			for (const message of messages) {
				await messageDb.create({
					id: message.key.id,
					message: message,
				})
			}
		}
	}
}
