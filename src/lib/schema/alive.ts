import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class AliveMessage extends Model {
	declare id: number;
	declare message: string;
}

await AliveMessage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: "alive_message",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (message: string) => {
		const [entry, created] = await AliveMessage.findOrCreate({
			where: { id: 1 },
			defaults: { message },
		});

		if (!created) {
			entry.message = message;
			await entry.save();
			return { changes: 1 };
		}

		return { changes: 1 };
	},

	get: async () => {
		const entry = await AliveMessage.findByPk(1);
		return entry?.message ?? "_I am alive_";
	},

	del: async () => {
		const deleted = await AliveMessage.destroy({ where: { id: 1 } });
		return deleted ? { changes: 1 } : undefined;
	},
};
