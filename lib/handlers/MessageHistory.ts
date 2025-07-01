import { saveContact, saveMessage } from "../schemas";
import type { BaileysEventMap, WASocket, MessageUpsertType } from "baileys";

export default class {
	client: WASocket;
	event: BaileysEventMap["messaging-history.set"];
	constructor(
		client: WASocket,
		event: BaileysEventMap["messaging-history.set"]
	) {
		this.client = client;
		this.event = event;
		this.process();
	}
	private async process() {
		await Promise.all([this.processContacts(), this.processMessages()]);
	}
	private async processContacts() {
		const contacts = this.event.contacts;
		for (const contact of contacts) {
			saveContact(contact);
		}
	}
	private async processMessages() {
		const messages = this.event.messages;
		const payload = {
			messages: messages,
			type: "append" as MessageUpsertType,
			requestId: undefined,
		};
		saveMessage(payload);
	}
}
