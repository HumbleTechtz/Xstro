import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Autokick extends Model {
	declare groupJid: string;
	declare jid: string | null;
	declare lid: string | null;
}

await Autokick.init(
	{
		groupJid: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false,
		},
		jid: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		lid: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "autokick",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (groupJid: string, jid: string | null, lid: string | null) => {
		const exists = await Autokick.findByPk(groupJid);

		if (exists) {
			exists.jid = jid;
			exists.lid = lid;
			await exists.save();
		} else {
			await Autokick.create({ groupJid, jid, lid });
		}
		return true;
	},

	remove: async (groupJid: string) => {
		const deleted = await Autokick.destroy({ where: { groupJid } });
		return deleted;
	},

	get: async (groupJid: string, id: string) => {
		const result = await Autokick.findByPk(groupJid);
		if (!result) return false;
		return result.jid === id || result.lid === id;
	},

	list: async () => {
		return await Autokick.findAll({
			attributes: ["groupJid", "jid", "lid"],
		});
	},
};
