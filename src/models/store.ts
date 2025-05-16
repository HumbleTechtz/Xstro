import database from './_db.ts';
import { WAProto } from 'baileys';
import { DataType } from 'qunatava';
import type { WAMessage, WAMessageContent, WAMessageKey } from 'baileys';

const messages = database.define(
	'messages',
	{
		id: { type: DataType.STRING },
		message: { type: DataType.JSON, allowNull: true },
	},
	{ timestamps: false },
);

const contacts = database.define('contacts', {
	id: {
		type: DataType.INTEGER,
		allowNull: false,
		unique: true,
		primaryKey: true,
		autoIncrement: true,
	},
	name: { type: DataType.STRING, allowNull: true },
	jid: { type: DataType.STRING, allowNull: true },
	lid: { type: DataType.STRING, allowNull: true },
});

export async function saveMessage(message: WAMessage) {
	return await messages.create({
		id: message.key.id!,
		message,
	});
}

export async function getMessage(
	key: WAMessageKey,
): Promise<WAMessageContent | undefined> {
	if (!key?.id) return;
	const record = await messages.findOne({ where: { id: key.id } });
	return record?.message
		? WAProto.Message.fromObject(JSON.parse(record.message as string).message)
		: undefined;
}

export async function loadMesage(
	key: WAMessageKey,
): Promise<WAMessage | undefined> {
	if (!key?.id) return;
	const record = await messages.findOne({ where: { id: key.id } });
	return record?.message
		? WAProto.WebMessageInfo.fromObject(JSON.parse(record.message as string))
		: undefined;
}

export async function getLastMessagesFromChat(
	jid: string,
): Promise<WAMessage[] | undefined> {
	const msgs = (await messages.findAll()) as { message: string }[];
	const filtered = msgs
		.map(m => JSON.parse(m.message) as WAMessage)
		.filter(m => m.key?.remoteJid === jid);
	return filtered.length ? filtered : undefined;
}

export async function saveContact(
	pushName?: string | null,
	jid?: string | null,
	lid?: string | null,
) {
	const exists = await contacts.findOne({ where: { name: pushName } });

	const data: Record<string, string> = {};
	if (pushName != null) data.name = pushName;
	if (jid != null) data.jid = jid;
	if (lid != null) data.lid = lid;

	if (exists) {
		await contacts.update(data, { where: { name: pushName } });
	} else {
		return await contacts.create(data);
	}
}
