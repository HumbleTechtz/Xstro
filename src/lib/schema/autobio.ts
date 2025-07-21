import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Autobio extends Model {
	declare status: number;
}

await Autobio.init(
	{
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		tableName: "autobio",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (status: 1 | 0) => {
		const exists = await Autobio.findOne();
		if (exists) {
			exists.status = status;
			await exists.save();
		} else {
			await Autobio.create({ status });
		}
		return true;
	},

	get: async () => {
		const result = await Autobio.findOne();
		return !!result?.status;
	},

	del: async () => {
		const deleted = await Autobio.destroy({ where: {} });
		return deleted;
	},
};
