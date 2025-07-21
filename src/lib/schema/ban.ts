import { DataTypes, Model, Op } from "sequelize";
import sqlite from "../../sqlite.ts";
import { isJidUser, isLidUser } from "baileys";

class BanUser extends Model {
	declare id: number;
	declare jid: string | null;
	declare lid: string | null;
}

await BanUser.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		jid: {
			type: DataTypes.TEXT,
			unique: true,
			allowNull: true,
		},
		lid: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "ban_user",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	add: async (jid: string, lid: string) => {
		if (!isJidUser(jid) || !isLidUser(lid)) return;

		const exists = await BanUser.findOne({ where: { jid } });
		if (!exists) {
			await BanUser.create({ jid, lid });
		}
		return { jid, lid };
	},

	list: async (banType: "jid" | "lid" = "jid") => {
		const records = await BanUser.findAll({
			attributes: [banType],
			where: {
				[banType]: { [Op.not]: null },
			},
		});
		return records
			.map(r => r.getDataValue(banType))
			.filter((v): v is string => Boolean(v));
	},

	remove: async (user: string) => {
		const field = isJidUser(user) ? "jid" : isLidUser(user) ? "lid" : undefined;
		if (!field) throw new Error("Invalid user format");

		await BanUser.destroy({ where: { [field]: user } });
		return { success: true, user };
	},

	check: async (user: string) => {
		const field = isJidUser(user) ? "jid" : isLidUser(user) ? "lid" : undefined;
		if (!field) return false;

		const exists = await BanUser.findOne({ where: { [field]: user } });
		return !!exists;
	},

	count: async () => {
		return await BanUser.count();
	},
};
