import {
	isJidGroup,
	jidNormalizedUser,
	normalizeMessageContent,
	type WAMessage,
	type WAMessageContent,
	type WAMessageKey,
	type WASocket,
} from "baileys";

export default class {
	jid: string;
	key: WAMessageKey;
	isGroup: boolean;
	sender: string;
	sudo: boolean;
	pushName: string;
	message: WAMessageContent;
	constructor(client: WASocket, message: WAMessage) {
		this.jid = message.key.remoteJid;
		this.key = message.key;
		this.isGroup = isJidGroup(this.jid);
		this.sender = this.isGroup
			? message.key.participant
			: this.key.fromMe
				? jidNormalizedUser(client.user.id)
				: message.key.remoteJid;
		this.sudo = [
			jidNormalizedUser(client.user.id),
			jidNormalizedUser(client.user.lid),
		].includes(this.sender);
		this.pushName = message.pushName;
		this.message = normalizeMessageContent(message.message);
	}
}
