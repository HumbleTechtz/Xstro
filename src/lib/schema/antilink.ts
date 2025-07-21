import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Antilink extends Model {
	declare jid: string;
	declare mode: number;
	declare links: string | null;
}

await Antilink.init(
	{
		jid: {
			type: DataTypes.TEXT,
			primaryKey: true,
			unique: true,
			allowNull: false,
		},
		mode: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		links: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "antilink",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (jid: string, mode: boolean, links?: string[]) => {
		const linksValue = links ? JSON.stringify(links) : null;
		const existing = await Antilink.findByPk(jid);

		if (existing) {
			existing.mode = mode ? 1 : 0;
			existing.links = linksValue;
			await existing.save();
		} else {
			await Antilink.create({ jid, mode: mode ? 1 : 0, links: linksValue });
		}
	},

	get: async (jid: string) => {
		const record = await Antilink.findByPk(jid);
		if (!record) return null;

		return {
			jid: record.jid,
			mode: record.mode != null ? Boolean(record.mode) : null,
			links: record.links ? JSON.parse(record.links) : [],
		};
	},

	remove: async (jid: string) => {
		await Antilink.destroy({ where: { jid } });
	},

	isActive: async (jid: string) => {
		const record = await Antilink.findByPk(jid);
		return record ? Boolean(record.mode) : false;
	},
};
