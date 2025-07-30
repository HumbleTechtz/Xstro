import { DataTypes } from "sequelize";
import database from "../database.ts";
import { WAProto, type WAMessage, type WAMessageKey } from "baileys";

const Messages = database.define(
	"messages",
	{
		id: { type: DataTypes.STRING, primaryKey: true },
		message: { type: DataTypes.TEXT, allowNull: true },
	},
	{ timestamps: false }
);

await Messages.sync();

export const Store = {
	save: async (message: WAMessage) => {
		const id = message.key.id;
		await Messages.upsert({ id, message: JSON.stringify(message) });
	},
	get: async (key: WAMessageKey) => {
		const id = key.id;
		const row = await Messages.findOne({ where: { id } });
		const msg = row?.get("message") as string;
		return WAProto.WebMessageInfo.fromObject(JSON.parse(msg));
	},
};
