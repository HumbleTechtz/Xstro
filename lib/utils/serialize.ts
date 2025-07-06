import {
	getContentType,
	jidNormalizedUser,
	normalizeMessageContent,
} from "baileys";
import type {
	WAContextInfo,
	WAMessage,
	WAMessageContent,
	WASocket,
} from "baileys";
import { extractTxt, isMediaMessage } from "./constants";

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
		text: extractTxt(message),
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
					text: extractTxt(message),
					//@ts-ignore
					viewonce: quotedM?.[quotedType]?.viewOnce as boolean,
					image: Boolean(quotedM?.imageMessage),
					video: Boolean(quotedM?.videoMessage),
					audio: Boolean(quotedM?.audioMessage),
					document: Boolean(quotedM?.documentMessage),
					sticker: Boolean(quotedM?.stickerMessage || message?.lottieStickerMessage),
			  }
			: undefined,
		send: async (content: any, type?: "text" | "video" | "audio" | "image") => {
			if (type) {
			}
			return await serialize(
				sock,
				//@ts-ignore
				await sock.sendMessage(chat, { text: content.toString() })
			);
		},
		edit: async function (text: string, msg?: WAMessage) {
			const m = msg ?? this.quoted ?? this;
			if (isMediaMessage(m)) {
				return await sock.sendMessage(
					chat!,
					getContentType(m.message!) === "imageMessage"
						? {
								image: { url: m.message?.imageMessage?.url! },
								caption: text,
								edit: m.key,
						  }
						: {
								video: { url: m.message?.videoMessage?.url! },
								caption: text,
								edit: m.key,
						  }
				);
			}
		},
	};
}

export type Serialize = ReturnType<typeof serialize> extends Promise<infer T>
	? T
	: undefined;
