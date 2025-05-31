import {
	downloadMediaMessage,
	getDevice,
	isJidGroup,
	isJidUser,
	isLidUser,
	jidNormalizedUser,
	normalizeMessageContent,
} from "baileys";
import { getSettings } from "../models/index.ts";
import {
	forwardM,
	getMessageContent,
	getQuotedContent,
	isBotAdmin,
	isMediaMessage,
	prepareMessage,
} from "../utils/index.ts";
import type {
	AnyMessageContent,
	WAContextInfo,
	WAMessage,
	WAMessageKey,
	WASocket,
} from "baileys";
import type { MessageMisc } from "../types/index.ts";

export async function serialize(client: WASocket, WAMessage: WAMessage) {
	const normalizedMessages = {
		...WAMessage,
		message: normalizeMessageContent(WAMessage?.message),
	};
	const { key, message, broadcast, ...messages } = normalizedMessages;
	const { prefix, mode, banned, disablecmd, disablegc, disabledm, sudo } =
		await getSettings();

	const jid = key.remoteJid as string;
	const isGroup = isJidGroup(jid) as boolean;
	const jidOwner = jidNormalizedUser(client?.user?.id);
	const lidOwner = jidNormalizedUser(client?.user?.lid);
	const sender =
		isJidGroup(jid) || broadcast
			? (key.participant as string)
			: key.fromMe
				? jidOwner
				: jid;

	const content = getMessageContent(message);
	const quoted = getQuotedContent(message, key, [jidOwner, lidOwner]);

	const isSudoUser = (user?: string) =>
		sudo.includes(user ?? "") || user === jidOwner || user === lidOwner;

	key.fromMe = [jidOwner, lidOwner].includes(sender);

	return {
		send: async function (
			content: string | Buffer,
			options?: MessageMisc & Partial<AnyMessageContent>,
		) {
			const message = await prepareMessage(client, content, {
				jid: this.jid,
				...options,
			});
			return serialize(client, message!);
		},
		downloadM: async function (message?: WAMessage) {
			return await downloadMediaMessage(message ?? this, "buffer", {});
		},
		forward: async function (
			jid: string,
			message: WAMessage,
			options?: WAContextInfo & { quoted: WAMessage },
		) {
			return await forwardM(client, jid, message, options);
		},
		react: async function (emoji?: string) {
			return await client.sendMessage(this.jid, {
				react: { text: emoji, key: this.key },
			});
		},
		editM: async function (text: string, msg?: WAMessage) {
			if (isMediaMessage(this)) {
				const media = await this.downloadM(msg ?? this);
				return await client.sendMessage(
					this.jid,
					this.mtype === "imageMessage"
						? { image: media, caption: text, edit: msg?.key ?? this.key }
						: { video: media, caption: text, edit: msg?.key ?? this.key },
				);
			}
			return await client.sendMessage(this.jid, { text, edit: this.key });
		},
		deleteM: async function (key: WAMessageKey) {
			const canDeleteForAll =
				this.key.fromMe || (this.isGroup && (await isBotAdmin(this)));
			console.log(`Can delete message`, canDeleteForAll);
			if (!canDeleteForAll) {
				return await client.chatModify(
					{
						deleteForMe: {
							deleteMedia: isMediaMessage(this),
							key: key,
							timestamp: Date.now(),
						},
					},
					this.jid,
				);
			}
			return await client.sendMessage(this.jid, { delete: key });
		},
		parseId: async function (id?: any) {
			if (id) {
				if (isLidUser(id) || isJidUser(id)) return id;
				id = id.replace(/\D+/g, "") + "@s.whatsapp.net";
				try {
					const result = await client.onWhatsApp(id);
					if (result?.[0]?.exists) return result[0].jid;
				} catch {
					return `${id.split("@")[0]}@lid`;
				}
			}

			if (this?.mention?.length! > 0) {
				let mentionedId = this.mention?.[0];
				if (isLidUser(mentionedId) || isJidUser(mentionedId)) return mentionedId;
				mentionedId = mentionedId?.replace(/\D+/g, "") + "@s.whatsapp.net";
				try {
					const result = await client.onWhatsApp(mentionedId);
					if (result?.[0]?.exists) return result[0].jid;
				} catch {
					return `${mentionedId.split("@")[0]}@lid`;
				}
			}
			if (this.quoted?.sender) return this.quoted.sender;
			if (!this.isGroup) return this.jid;
			return undefined;
		},
		key,
		jid,
		isGroup,
		prefix,
		sender,
		mode,
		banned,
		disablecmd,
		disablegc,
		disabledm,
		broadcast,
		owner: { jid: jidOwner, lid: lidOwner },
		mention: quoted?.mentionedJid,
		device: getDevice(key?.id ?? ""),
		sudo: isSudoUser(sender),
		quoted: quoted
			? {
					sudo: isSudoUser(quoted.sender),
					...quoted,
				}
			: undefined,
		...content,
		...messages,
		...client,
	};
}
