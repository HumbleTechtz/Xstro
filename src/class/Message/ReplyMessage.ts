import {
	getContentType,
	jidNormalizedUser,
	normalizeMessageContent,
	type WAContextInfo,
	type WAMessage,
	type WAMessageContent,
	type WAMessageKey,
	type WASocket,
} from "baileys";

export default class {
	private quoted: WAContextInfo;
	key: WAMessageKey;
	sender: string;
	sudo: boolean;
	message: WAMessageContent;
	mtype: keyof WAMessageContent | undefined;
	image: boolean;
	video: boolean;
	audio: boolean;
	document: boolean;
	sticker: boolean;
	viewonce: boolean;
	constructor(client: WASocket, message: WAMessage) {
		//@ts-ignore
		this.quoted = message?.message[getContentType(message.message)]?.contextInfo;
		this.key = {
			remoteJid: message.key.remoteJid,
			fromMe: [
				jidNormalizedUser(client.user.id),
				jidNormalizedUser(client.user.lid),
			].includes(this.quoted?.participant),
			id: this.quoted?.stanzaId,
			participant: this.quoted?.participant,
		};
		this.sender = this.quoted?.participant;
		this.sudo = [
			jidNormalizedUser(client.user.id),
			jidNormalizedUser(client.user.lid),
		].includes(this.sender);
		this.message = normalizeMessageContent(this.quoted?.quotedMessage);
		this.mtype = getContentType(this?.message);
		this.image = this.mtype === "imageMessage";
		this.video = this.mtype === "videoMessage";
		this.audio = this.mtype === "audioMessage";
		this.document = this.mtype === "documentMessage";
		this.sticker = this.mtype === "stickerMessage";
		//@ts-ignore
		this.viewonce = this.message?.[this.mtype]?.viewOnce;
		Object.defineProperty(this, "quoted", {
			//@ts-ignore
			value: message?.message[getContentType(message.message)]?.contextInfo,
			writable: false,
			enumerable: false,
			configurable: false,
		});
	}
}
