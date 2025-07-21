import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Anticall extends Model {
	declare mode: number;
	declare action: string;
}

await Anticall.init(
	{
		mode: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		action: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "anticall",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	get: async () => {
		const record = await Anticall.findOne();
		if (record) {
			return {
				mode: record.mode != null ? Boolean(record.mode) : null,
				action: record.action as "block" | "warn",
			};
		}
		return null;
	},

	set: async function (mode: boolean, action: "block" | "warn") {
		const current = await this.get();
		if (current && current.mode === mode && current.action === action) {
			return false;
		}
		await Anticall.destroy({ where: {} });
		await Anticall.create({ mode: mode ? 1 : 0, action });
		return true;
	},

	remove: async () => {
		const deleted = await Anticall.destroy({ where: {} });
		return deleted;
	},
};
