import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Automute extends Model {
	declare jid: string;
	declare startTime: string;
	declare endTime: string | null;
}

await Automute.init(
	{
		jid: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false,
		},
		startTime: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		endTime: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "automute",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (jid: string, startTime: string, endTime?: string) => {
		const existing = await Automute.findByPk(jid);

		if (existing) {
			existing.startTime = startTime;
			existing.endTime = endTime ?? null;
			await existing.save();
		} else {
			await Automute.create({ jid, startTime, endTime: endTime ?? null });
		}

		return true;
	},

	remove: async (jid: string) => {
		const deleted = await Automute.destroy({ where: { jid } });
		return deleted;
	},

	get: async (jid: string) => {
		const result = await Automute.findByPk(jid) as {startTime:string;endTime: string};
		return result ?? null;
	},

	list: async () => {
		return await Automute.findAll({
			attributes: ["jid", "startTime", "endTime"],
		});
	},
};
