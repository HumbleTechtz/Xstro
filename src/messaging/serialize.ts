import { isJidGroup, normalizeMessageContent } from 'baileys';
import { getSettings } from '../models/index.ts';
import {
	getMessageContent,
	getQuotedContent,
	parseJid,
} from '../utils/index.ts';
import type { WAMessage, WASocket } from 'baileys';

export async function serialize(client: WASocket, WAMessage: WAMessage) {
	const normalizedMessages = {
		...WAMessage,
		message: normalizeMessageContent(WAMessage?.message),
	};
	const { key, message, broadcast, ...messages } = normalizedMessages;
	const { prefix, mode, sudo, banned, disablecmd, disablegc, disabledm } =
		await getSettings();
	const jid = key.remoteJid ?? '';
	const isGroup = isJidGroup(key.remoteJid!);
	const owner = parseJid(client?.user?.id);
	const sender =
		isJidGroup(key.remoteJid!) || broadcast
			? key.participant
			: key.fromMe
				? owner
				: key.remoteJid;

	const content = getMessageContent(message);
	const quoted = getQuotedContent(message, key, owner);

	return {
		key,
		jid,
		isGroup,
		owner,
		prefix,
		sender,
		mode,
		banned,
		disablecmd,
		disablegc,
		disabledm,
		mention: quoted?.mentionedJid,
		sudo: sudo.includes(parseJid(sender)) ? true : sender === owner,
		...content,
		...messages,
		quoted: quoted ? { ...quoted } : undefined,
		user: function (match?: string): string | undefined {
			if (this.isGroup) {
				if (quoted && quoted.sender) return quoted.sender;
				if (!match) return undefined;
				return parseJid(match);
			} else {
				if (quoted && quoted.sender) return quoted.sender;
				if (!match) return this.key.remoteJid!;
				return parseJid(match);
			}
		},
	};
}
