import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Antidelete extends Model {
	declare mode: number;
}

await Antidelete.init(
	{
		mode: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		tableName: "antidelete",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (mode: boolean) => {
		const record = await Antidelete.findOne();
		if (!record) {
			await Antidelete.create({ mode: mode ? 1 : 0 });
			return true;
		}
		if (Boolean(record.mode) === mode) return false;
		await Antidelete.destroy({ where: {} });
		await Antidelete.create({ mode: mode ? 1 : 0 });
		return true;
	},

	get: async () => {
		const record = await Antidelete.findOne();
		return Boolean(record?.mode);
	},
};
