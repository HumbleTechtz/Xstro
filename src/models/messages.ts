import { DataTypes } from "quantava";
import database from "../Core/database.ts";
import { WAProto, type BaileysEventMap, type WAMessageKey } from "baileys";

const Messages = database.define("messages", {
	id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
	messages: { type: DataTypes.JSON },
	requestId: { type: DataTypes.STRING },
});

export const save_message = async (
	event: BaileysEventMap["messages.upsert"],
) => {
	if (!event?.messages?.[0]?.key?.id) return;
	const id = event.messages[0].key.id;
	const requestId = event.requestId ?? null;

	await Messages.create({ id, messages: event.messages[0], requestId });
};

export const getMessage = async (key: WAMessageKey) => {
	const exists = (await Messages.findOne({ where: { id: key.id } })) as {
		id: string;
		messages: string;
		requestId?: string;
	} | null;
	if (exists?.messages) {
		return (
			WAProto.WebMessageInfo.fromObject(JSON.parse(exists.messages)).message ||
			undefined
		);
	}
};
