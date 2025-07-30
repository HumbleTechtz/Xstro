import {
	getContentType,
	isJidGroup,
	jidNormalizedUser,
	normalizeMessageContent,
	type WAMessage,
	type WAMessageContent,
	type WAMessageKey,
	type WASocket,
} from "baileys";
import ReplyMessage from "./ReplyMessage.ts";

export default class {
	key: WAMessageKey;
	from: string;
	isGroup: boolean;
	sender: string;
	sudo: boolean;
	pushName: string;
	message: WAMessageContent;
	mtype: keyof WAMessageContent | undefined;
	image: boolean;
	video: boolean;
	audio: boolean;
	document: boolean;
	sticker: boolean;
	viewonce: boolean;
	quoted: ReplyMessage | undefined;
	constructor(client: WASocket, message: WAMessage) {
		this.key = message.key;
		this.from = message.key.remoteJid;
		this.isGroup = isJidGroup(this.from);
		this.sender =
			this.isGroup || message.broadcast
				? message.key.participant
				: this.key.fromMe
					? jidNormalizedUser(client.user.id)
					: this.from;
		this.sudo = [
			jidNormalizedUser(client.user.id),
			jidNormalizedUser(client.user.lid),
		].includes(this.sender);
		this.pushName = message.pushName;
		this.message = normalizeMessageContent(message.message);
		this.mtype = getContentType(this.message);
		this.image = this.mtype === "imageMessage";
		this.video = this.mtype === "videoMessage";
		this.audio = this.mtype === "audioMessage";
		this.document = this.mtype === "documentMessage";
		this.sticker =
			this.mtype === "stickerMessage" || this.mtype === "lottieStickerMessage";
		//@ts-ignore
		this.viewonce = this.message?.[this.mtype]?.viewOnce;
		//@ts-ignore
		this.quoted = this.message?.[this.mtype]?.contextInfo?.stanzaId
			? new ReplyMessage(client, message)
			: undefined;
	}
}
