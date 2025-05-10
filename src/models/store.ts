import database from './_db.ts';
import { WAProto } from 'baileys';
import { DataType } from '@astrox11/sqlite';
import type { WAMessage, WAMessageContent, WAMessageKey } from 'baileys';

export const store = database.define(
	'messages',
	{
		id: { type: DataType.STRING },
		message: { type: DataType.JSON, allowNull: true },
	},
	{ timestamps: false },
);

export async function preserveMessage(message: WAMessage) {
	return await store.create({
		id: message.key.id!,
		message,
	});
}

export async function getMessage(
	key: WAMessageKey,
): Promise<WAMessageContent | undefined> {
	if (!key?.id) return;
	const record = await store.findOne({ where: { id: key.id } });
	return record?.message
		? WAProto.Message.fromObject(JSON.parse(record.message as string).message)
		: undefined;
}

export async function loadMesage(
	key: WAMessageKey,
): Promise<WAMessage | undefined> {
	if (!key?.id) return;
	const record = await store.findOne({ where: { id: key.id } });
	return record?.message
		? WAProto.WebMessageInfo.fromObject(JSON.parse(record.message as string))
		: undefined;
}

export async function getLastMessagesFromChat(
	jid: string,
): Promise<WAMessage[] | undefined> {
	const msgs = (await store.findAll()) as { message: string }[];
	const filtered = msgs
		.map(m => JSON.parse(m.message) as WAMessage)
		.filter(m => m.key?.remoteJid === jid);
	return filtered.length ? filtered : undefined;
}
