/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Abstracts a WhatsApp message into a structured format for easier handling.
 * @module serialize
 * @copyright Copyright (c) 2025 AstroX11
 */

import {
	AnyMessageContent,
	downloadMediaMessage,
	getContentType,
	getDevice,
	isJidGroup,
	isJidNewsletter,
	isJidUser,
	jidNormalizedUser,
	normalizeMessageContent,
	WAContextInfo,
	WAMessageContent,
	WAProto,
	type WAMessage,
	type WASocket,
} from "baileys";
import { getDataType, isAdmin, isBotAdmin, text_from_message } from "../Utils";
import {
	forwardMessage,
	isMediaMessage,
	sendMessage,
	type mtype,
} from "./send_msg";
import { isSudo, getSettings, cachedGroupMetadata } from "../Models";

const msg_default_payload = async (
	normalizedMessage: WAMessageContent | null | undefined,
	msgType: keyof WAMessageContent,
	sender: string,
	chat: string,
	isGroup: boolean
) => ({
	message: normalizedMessage,
	msg_type: msgType,
	image: msgType === "imageMessage",
	video: msgType === "videoMessage",
	audio: msgType === "audioMessage",
	document: msgType === "documentMessage",
	sticker: msgType === "stickerMessage",
	//@ts-ignore
	viewonce: normalizedMessage?.[msgType]?.viewOnce as boolean,
	text: text_from_message(normalizedMessage!),
	sender,
	isAdmin: isGroup ? isAdmin(chat, sender) : undefined,
});

export async function serialize(sock: WASocket, msg: WAMessage) {
	let { key, message, broadcast, ...props } = msg;
	let { prefix, mode } = getSettings();

	message = normalizeMessageContent(message);
	broadcast = Boolean(broadcast);

	const chat = String(key.remoteJid);
	const isGroup = Boolean(isJidGroup(chat));
	const newsletter = Boolean(isJidNewsletter(chat));

	const owner = {
		jid: jidNormalizedUser(sock.user?.id),
		lid: jidNormalizedUser(sock.user?.lid),
	};

	const sender =
		isGroup || broadcast
			? String(key.participant)
			: key.fromMe
			? owner.jid
			: chat;

	const msg_type = getContentType(message);

	let quoted: WAContextInfo | undefined;

	if (
		msg_type &&
		message &&
		typeof message[msg_type] === "object" &&
		message[msg_type] !== null &&
		"contextInfo" in message[msg_type]
	) {
		quoted = (message[msg_type] as { contextInfo?: WAContextInfo }).contextInfo;
	}

	const baseStructure = await msg_default_payload(
		message,
		msg_type!,
		sender,
		chat,
		isGroup
	);

	return {
		chat,
		key,
		isGroup,
		newsletter,
		broadcast,
		owner,
		prefix,
		mode,
		...baseStructure,
		sudo: isSudo(sender),
		device: getDevice(key.id!),
		mentions: quoted?.mentionedJid,
		isBotAdmin: isGroup ? isBotAdmin(owner, chat) : undefined,
		...props,
		quoted: quoted
			? {
					key: {
						remoteJid: chat,
						fromMe: [owner.jid, owner.lid].includes(quoted.participant!),
						id: quoted.stanzaId,
						participant: isGroup ? quoted.participant : undefined,
					},
					sudo: isSudo(quoted.participant!),
					device: getDevice(quoted.stanzaId!),
					broadcast: Boolean(quoted?.remoteJid),
					participant: quoted.participant,
					...(await msg_default_payload(
						normalizeMessageContent(quoted.quotedMessage),
						getContentType(normalizeMessageContent(quoted.quotedMessage))!,
						String(quoted.participant),
						chat,
						isGroup
					)),
			  }
			: undefined,
		proto: WAProto,
		send: async function (
			content: string | Buffer,
			options?: {
				jid?: string;
				mimetype?: string;
				type?: mtype;
				quoted?: WAMessage;
			} & Partial<AnyMessageContent>
		) {
			const message = await sendMessage(sock, content, {
				jid: chat,
				...options,
			});
			return serialize(sock, message!);
		},
		edit: async function (text: string, msg?: WAMessage) {
			const m = msg ?? this.quoted ?? this;
			if (isMediaMessage(m)) {
				return await sock.sendMessage(
					chat,
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
			return await sock.sendMessage(chat, {
				text,
				edit: m.key,
			});
		},
		download: async function (options?: { message?: WAMessage; save?: boolean }) {
			const media = await downloadMediaMessage(
				options?.message ?? this.quoted ?? this,
				"buffer",
				{}
			);
			if (options?.save) {
				const { ext } = await getDataType(media);
				const fs = await import("fs/promises");
				const os = await import("os");
				const path = `${os.tmpdir()}/${Date.now()}.${ext}`;
				await fs.writeFile(path, media);
				return path;
			}
			return media;
		},
		react: async function (emoji: string) {
			return await sock.sendMessage(chat, {
				react: { text: emoji, key: this.key },
			});
		},
		forward: async function (
			jid: string,
			message: WAMessage,
			options?: WAContextInfo & { quoted: WAMessage }
		) {
			return await forwardMessage(sock, jid, message, options);
		},
		delete: async function (msg?: WAMessage) {
			const canDeleteForAll = isGroup && this.isBotAdmin ? true : false;
			if (!canDeleteForAll) {
				return await sock.chatModify(
					{
						deleteForMe: {
							deleteMedia: isMediaMessage(this),
							key: msg?.key ?? this.quoted?.key ?? key,
							timestamp: Date.now(),
						},
					},
					chat
				);
			}
			return await sock.sendMessage(chat, {
				delete: msg?.key ?? this.quoted?.key ?? key,
			});
		},
		userId: async function (user?: string) {
			if (user) {
				user = user.replace(/\D/g, "");
				return (await this.onWhatsApp(`${user}@s.whatsapp.net`))
					? `${user}@s.whatsapp.net`
					: `${user}@lid`;
			}

			if (this?.quoted?.participant) return this.quoted.participant;

			if (this?.mentions && this.mentions.length > 0) {
				const id = this?.mentions[0]?.replace(/\D/g, "");
				return (await this.onWhatsApp(`${id}@s.whatsapp.net`))
					? `${id}@s.whatsapp.net`
					: `${id}@lid`;
			}
			return chat;
		},
		userInfo: async function (id: string) {
			if (isGroup) {
				const { participants, addressingMode } = cachedGroupMetadata(chat);
				const found = participants.find(p =>
					addressingMode === "pn"
						? p.jid === id || p.lid === id
						: p.lid === id || p.jid === id
				);
				return { jid: found?.jid as string, lid: found?.lid as string };
			}
			const infoArr = (await this.onWhatsApp(id)) as
				| { jid: string; exists: boolean; lid: string }[]
				| undefined;
			const info = infoArr?.[0];
			return { jid: info?.jid as string, lid: info?.lid as string };
		},
		...(({ ev, logger, ws, ...rest }) => rest)(sock),
	};
}

export type Serialize = ReturnType<typeof serialize> extends Promise<infer T>
	? T
	: undefined;
