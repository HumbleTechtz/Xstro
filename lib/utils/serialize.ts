import { jidNormalizedUser, normalizeMessageContent } from "baileys";
import type {
	WAContextInfo,
	WAMessage,
	WAMessageContent,
	WASocket,
} from "baileys";

export async function serialize(sock: WASocket, msg: WAMessage) {
	let { key, message, broadcast, pushName } = msg;

	message = normalizeMessageContent(message);
	broadcast = Boolean(broadcast);

	const chat = key.remoteJid;
	const isGroup = Boolean(key.remoteJid?.endsWith("@g.us"));

	const owner = {
		jid: jidNormalizedUser(sock.user?.id),
		lid: jidNormalizedUser(sock.user?.lid),
	};

	const mtype = Object.keys(message ?? "").find(
		k =>
			(k === "conversation" || k.includes("Message")) &&
			k !== "senderKeyDistributionMessage"
	) as keyof WAMessageContent | undefined;

	let quoted: WAContextInfo | undefined;
	let quotedM: WAMessageContent | null | undefined;
	let quotedType: keyof WAMessageContent | undefined;

	if (
		mtype &&
		message &&
		typeof message[mtype] === "object" &&
		message[mtype] !== null &&
		"contextInfo" in message[mtype]
	) {
		quoted = (message[mtype] as { contextInfo?: WAContextInfo })?.contextInfo;
		quotedM = quoted ? quoted.quotedMessage : undefined;
	}

	return {
		chat,
		key,
		isGroup,
		broadcast,
		owner,
		mtype,
		pushName,
		sender:
			isGroup || broadcast
				? key.participant
				: key.fromMe
				? owner.jid
				: key.remoteJid,
		message: message,
		mentions: quoted?.mentionedJid,
		image: Boolean(message?.imageMessage),
		video: Boolean(message?.videoMessage),
		audio: Boolean(message?.audioMessage),
		document: Boolean(message?.documentMessage),
		sticker: Boolean(message?.stickerMessage || message?.lottieStickerMessage),
		viewonce: key.isViewOnce,
		quoted: quoted
			? {
					key: {
						remoteJid: key.remoteJid,
						fromMe: [owner.jid, owner.lid].includes(quoted.participant!),
						id: quoted.stanzaId,
						participant: isGroup ? quoted.participant : undefined,
					},
					broadcast: Boolean(quoted?.remoteJid),
					sender: quoted.participant,
					message: quotedM,
					//@ts-ignore
					viewonce: quotedM?.[quotedType]?.viewOnce as boolean,
					image: Boolean(quotedM?.imageMessage),
					video: Boolean(quotedM?.videoMessage),
					audio: Boolean(quotedM?.audioMessage),
					document: Boolean(quotedM?.documentMessage),
					sticker: Boolean(quotedM?.stickerMessage || message?.lottieStickerMessage),
			  }
			: undefined,
	};
}

export type Serialize = ReturnType<typeof serialize> extends Promise<infer T>
	? T
	: undefined;
