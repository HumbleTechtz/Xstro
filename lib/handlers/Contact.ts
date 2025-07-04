import { saveContact } from "../schemas";
import {
	type WASocket,
	type BaileysEventMap,
	isJidUser,
	isLidUser,
} from "baileys";

export default class {
	client: WASocket;
	updates: {
		upsert: BaileysEventMap["contacts.upsert"];
		update: BaileysEventMap["contacts.update"];
	};
	constructor(
		client: WASocket,
		updates: {
			upsert: BaileysEventMap["contacts.upsert"];
			update: BaileysEventMap["contacts.update"];
		}
	) {
		this.client = client;
		this.updates = updates;
		this.process();
	}

	private process() {
		const contacts = this.updates.upsert ?? this.updates.update;
		for (const contact of contacts) {
			if (isJidUser(contact.id) || isLidUser(contact.id)) {
				saveContact(contact);
			}
		}
	}
}
