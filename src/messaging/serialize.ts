import { isJidGroup, normalizeMessageContent } from 'baileys';
import { getSettings } from '../models/index.ts';
import {
	getMessageContent,
	getQuotedContent,
	parseJidLid,
} from '../utils/index.ts';
import type { WAMessage, WASocket } from 'baileys';

export async function serialize(client: WASocket, WAMessage: WAMessage) {
	const normalizedMessages = {
		...WAMessage,
		message: normalizeMessageContent(WAMessage?.message),
	};
	const { key, message, broadcast, ...messages } = normalizedMessages;
	const { prefix, mode, banned, disablecmd, disablegc, disabledm } =
		await getSettings();
	const jid = key.remoteJid ?? '';
	const isGroup = isJidGroup(key.remoteJid!);
	const ownerJid = parseJidLid(client?.user?.id);
	const ownerLid = parseJidLid(client?.user?.lid);
	const sender =
		isJidGroup(key.remoteJid!) || broadcast
			? key.participant
			: key.fromMe
				? ownerJid
				: key.remoteJid;
	const sudo_users = await getSettings().then(settings => settings.sudo);

	const content = getMessageContent(message);
	const quoted = getQuotedContent(message, key, ownerJid);

	return {
		key,
		jid,
		isGroup,
		owner: ownerJid,
		prefix,
		sender,
		mode,
		banned,
		disablecmd,
		disablegc,
		disabledm,
		mention: quoted?.mentionedJid,
		sudo: sudo_users.includes(sender ?? '')
			? true
			: sender === (ownerJid ?? ownerLid),
		...content,
		...messages,
		quoted: quoted ? { ...quoted } : undefined,
		user: function (match?: string): string | undefined {
			if (this.isGroup) {
				if (quoted && quoted.sender) return quoted.sender;
				if (!match) return undefined;
				return parseJidLid(match);
			} else {
				if (quoted && quoted.sender) return quoted.sender;
				if (!match) return this.key.remoteJid!;
				parseJidLid(match);
				return parseJidLid(match);
			}
		},
	};
}
