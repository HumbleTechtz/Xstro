import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Antiword extends Model {
	declare jid: string;
	declare status: number;
	declare words: string | null;
}

await Antiword.init(
	{
		jid: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		words: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "antiword",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (jid: string, status: boolean, words: string[]) => {
		const badWords = Array.from(new Set(words));
		const mode = status ? 1 : 0;
		const existing = await Antiword.findByPk(jid);

		if (existing) {
			existing.status = mode;
			existing.words = JSON.stringify(badWords);
			await existing.save();
		} else {
			await Antiword.create({
				jid,
				status: mode,
				words: JSON.stringify(badWords),
			});
		}

		return { enabled: true, words: badWords.length };
	},

	remove: async (jid: string) => {
		const deleted = await Antiword.destroy({ where: { jid } });
		return deleted > 0;
	},

	get: async (jid: string) => {
		const record = await Antiword.findByPk(jid);
		if (!record) return null;

		return {
			jid: record.jid,
			status: record.status != null ? Boolean(record.status) : null,
			words: record.words ? JSON.parse(record.words) : [],
		};
	},
};
