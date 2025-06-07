import database from "../Core/database.ts";
import { WAProto } from "baileys";
import { DataTypes } from "quantava";
import type { WAMessage, WAMessageContent, WAMessageKey } from "baileys";
import type { Serialize } from "../Types/index.ts";
import { stripCircularRefs } from "../Utils/constants.ts";

export const messageDb = database.define("messages", {
	id: { type: DataTypes.STRING },
	message: { type: DataTypes.JSON, allowNull: true },
});

export async function saveMsg(msg: Serialize) {
	const safeMsg = stripCircularRefs(msg);
	return await messageDb.create({
		id: msg.key.id,
		message: safeMsg,
	});
}

export async function getMessage(
	key: WAMessageKey,
): Promise<WAMessageContent | undefined> {
	if (!key?.id) return;
	const record = (await messageDb.findOne({ where: { id: key.id } })) as {
		message: string;
	};
	return record?.message
		? WAProto.Message.fromObject(JSON.parse(record.message).message)
		: undefined;
}

export async function loadMesage(
	key: WAMessageKey,
): Promise<WAMessage | undefined> {
	if (!key?.id) return;
	const record = (await messageDb.findOne({ where: { id: key.id } })) as {
		message: string;
	};
	return record?.message
		? WAProto.WebMessageInfo.fromObject(JSON.parse(record.message))
		: undefined;
}

export async function getLastMessagesFromChat(jid: string) {
	const records = await messageDb.findAll();
	const msg = records.map((m: any) => JSON.parse(m.messages as string));
	return msg
		.filter(m => m.key.remoteJid === jid)
		.map((m: any) => WAProto.WebMessageInfo.fromObject(m));
}
