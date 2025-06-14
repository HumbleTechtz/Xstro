import {
	downloadMediaMessage,
	getDevice,
	isJidGroup,
	jidNormalizedUser,
	normalizeMessageContent,
} from "baileys";
import {
	findJidLid,
	forwardM,
	getMessageContent,
	getQuotedContent,
	isAdmin,
	isBotAdmin,
	isMediaMessage,
	parseUserId,
	prepareMessage,
} from "../Utils/index.ts";
import { isSudo } from "../Models/Sudo.ts";
import { getMode, getPrefix } from "../Models/Settings.ts";
import { cachedGroupMetadata } from "../Models/GroupCache.ts";
import type { MessageMisc } from "../Types/index.ts";
import type {
	AnyMessageContent,
	WAContextInfo,
	WAMessage,
	WAMessageKey,
	WASocket,
} from "baileys";

export async function serialize(client: WASocket, WAMessage: WAMessage) {
	const normalizedMessages = {
		...WAMessage,
		message: normalizeMessageContent(WAMessage?.message),
	};
	const { key, message, broadcast, ...messages } = normalizedMessages;
	const jid = key.remoteJid as string;
	const isGroup = isJidGroup(jid) as boolean;
	const jidOwner = jidNormalizedUser(client?.user?.id);
	const lidOwner = jidNormalizedUser(client?.user?.lid);
	const owner = { jid: jidOwner, lid: lidOwner };
	const sender =
		isGroup || broadcast
			? (key.participant as string)
			: key.fromMe
			? jidOwner
			: jid;

	const content = getMessageContent(message);
	const quoted = getQuotedContent(message, key, [jidOwner, lidOwner]);

	return {
		send: async function (
			content: string | Buffer,
			options?: MessageMisc & Partial<AnyMessageContent>
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
			options?: WAContextInfo & { quoted: WAMessage }
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
						: { video: media, caption: text, edit: msg?.key ?? this.key }
				);
			}
			return await client.sendMessage(this.jid, { text, edit: this.key });
		},
		deleteM: async function (key: WAMessageKey) {
			const canDeleteForAll =
				this.key.fromMe || (this.isGroup && this.isBotAdmin);
			if (!canDeleteForAll) {
				return await client.chatModify(
					{
						deleteForMe: {
							deleteMedia: isMediaMessage(this),
							key: key,
							timestamp: Date.now(),
						},
					},
					this.jid
				);
			}
			return await client.sendMessage(this.jid, { delete: key });
		},
		parseId: async function (id?: any) {
			const parsedId = await parseUserId(id, client);
			if (parsedId) return parsedId;

			if (isGroup && id) {
				const { participants, addressingMode } = await cachedGroupMetadata(jid);
				return findJidLid(client, participants, id, addressingMode);
			}

			if (this.quoted?.sender) return this.quoted.sender;

			if (!this.isGroup) return this.jid;

			return undefined;
		},
		key,
		jid,
		isGroup,
		sender,
		owner,
		broadcast,
		isAdmin: isGroup ? await isAdmin(jid, sender) : null,
		isBotAdmin: isGroup ? await isBotAdmin(owner, jid) : null,
		prefix: await getPrefix(),
		mode: await getMode(),
		mention: quoted?.mentionedJid,
		device: getDevice(key?.id!),
		sudo: await isSudo(sender),
		quoted: quoted
			? {
					sudo: await isSudo(quoted.sender),
					...quoted,
			  }
			: undefined,
		...content,
		...messages,
		...client,
	};
}

export type Serialize = ReturnType<typeof serialize> extends Promise<infer T>
	? T
	: undefined;
