import { DataTypes, Model } from "sequelize";
import { WAMessage, WAProto, type WAMessageKey } from "baileys";
import sqlite from "../../sqlite.ts";

class Message extends Model {
	declare id: string;
	declare messages: string;
}

await Message.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		messages: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "messages",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	save: async (message: WAMessage) => {
		if (!message?.key?.id) return;
		const id = message.key.id;
		try {
			await Message.create({
				id,
				messages: JSON.stringify(message),
			});
		} catch {}
	},

	load: async (key: WAMessageKey) => {
		if (!key.id) return undefined;
		const record = await Message.findByPk(key.id);
		if (!record?.messages) return undefined;
		try {
			const parsed = JSON.parse(record.messages);
			return WAProto.WebMessageInfo.fromObject(parsed);
		} catch {
			return undefined;
		}
	},

	get: async (key: WAMessageKey): Promise<WAProto.IMessage | undefined> => {
		if (!key) return undefined;
		return WAProto.Message.fromObject({});
	},
};
