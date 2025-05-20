import database from '../messaging/database.ts';
import { WAProto } from 'baileys';
import { DataType } from 'quantava';
import type { WAMessage, WAMessageContent, WAMessageKey } from 'baileys';

export const messageDb = database.define(
	'messages',
	{
		id: { type: DataType.STRING },
		messages: { type: DataType.JSON, allowNull: true },
		type: { type: DataType.STRING, allowNull: true },
		requestId: { type: DataType.STRING, allowNull: true },
	},
	{ timestamps: false },
);

export async function getMessage(
	key: WAMessageKey,
): Promise<WAMessageContent | undefined> {
	if (!key?.id) return;
	const record = await messageDb.findOne({ where: { id: key.id } });
	return record?.message
		? WAProto.Message.fromObject(JSON.parse(record.message as string).message)
		: undefined;
}

export async function loadMesage(
	key: WAMessageKey,
): Promise<WAMessage | undefined> {
	if (!key?.id) return;
	const record = await messageDb.findOne({ where: { id: key.id } });
	return record?.message
		? WAProto.WebMessageInfo.fromObject(JSON.parse(record.message as string))
		: undefined;
}

export async function getLastMessagesFromChat(
	jid: string,
): Promise<WAMessage[] | undefined> {
	const msgs = (await messageDb.findAll()) as { message: string }[];
	const filtered = msgs
		.map(m => JSON.parse(m.message) as WAMessage)
		.filter(m => m.key?.remoteJid === jid);
	return filtered.length ? filtered : undefined;
}
