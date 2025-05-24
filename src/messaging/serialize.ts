import { getDevice, isJidGroup, normalizeMessageContent } from 'baileys';
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
	const settings = await getSettings();
	const { prefix, mode, banned, disablecmd, disablegc, disabledm, sudo } =
		settings;

	const jid = key.remoteJid ?? '';
	const isGroup = isJidGroup(key.remoteJid!);
	const jidOwner = parseJidLid(client?.user?.id);
	const lidOwner = parseJidLid(client?.user?.lid);
	const sender =
		isJidGroup(jid) || broadcast
			? (key.participant as string)
			: key.fromMe
				? jidOwner
				: jid;

	const content = getMessageContent(message);
	const quoted = getQuotedContent(message, key, jidOwner);

	const isSudoUser = (user?: string) =>
		sudo.includes(user ?? '') || user === jidOwner || user === lidOwner;

	return {
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
		owner: jidOwner,
		mention: quoted?.mentionedJid,
		device: getDevice(key?.id ?? ''),
		sudo: isSudoUser(sender),
		...content,
		...messages,
		quoted: quoted
			? {
					sudo: isSudoUser(quoted.sender),
					...quoted,
				}
			: undefined,
		user(match?: string): string | undefined {
			if (quoted?.sender) return quoted.sender;
			if (this.isGroup) {
				return match ? parseJidLid(match) : undefined;
			}
			return match ? parseJidLid(match) : this.key.remoteJid!;
		},
	};
}
