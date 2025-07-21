import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class GroupJoin extends Model {
	declare groupJid: string;
	declare welcome: string | null;
	declare goodbye: string | null;
}

await GroupJoin.init(
	{
		groupJid: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false,
		},
		welcome: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		goodbye: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "group_join",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

function transformRecord(record: GroupJoin) {
	return {
		groupJid: record.groupJid,
		welcome: record.welcome || null,
		goodbye: record.goodbye || null,
	};
}

export default {
	welcome: {
		set: async (id: string, text: string) => {
			const normalizedId = id.trim();
			const existing = await GroupJoin.findByPk(normalizedId);

			if (existing) {
				existing.welcome = text;
				await existing.save();
			} else {
				await GroupJoin.create({ groupJid: normalizedId, welcome: text });
			}

			return { groupJid: normalizedId, welcome: text, goodbye: null };
		},

		get: async (id: string) => {
			const normalizedId = id.trim();
			const record = await GroupJoin.findByPk(normalizedId);
			return record ? record.welcome || null : null;
		},

		del: async (id: string) => {
			const normalizedId = id.trim();
			const existing = await GroupJoin.findByPk(normalizedId);
			if (!existing) return { success: false, groupJid: normalizedId };

			existing.welcome = null;
			await existing.save();

			return { success: true, groupJid: normalizedId };
		},
	},

	goodbye: {
		set: async (id: string, text: string) => {
			const normalizedId = id.trim();
			const existing = await GroupJoin.findByPk(normalizedId);

			if (existing) {
				existing.goodbye = text;
				await existing.save();
			} else {
				await GroupJoin.create({ groupJid: normalizedId, goodbye: text });
			}

			return { groupJid: normalizedId, welcome: null, goodbye: text };
		},

		get: async (id: string) => {
			const normalizedId = id.trim();
			const record = await GroupJoin.findByPk(normalizedId);
			return record ? record.goodbye || null : null;
		},

		del: async (id: string) => {
			const normalizedId = id.trim();
			const existing = await GroupJoin.findByPk(normalizedId);
			if (!existing) return { success: false, groupJid: normalizedId };

			existing.goodbye = null;
			await existing.save();

			return { success: true, groupJid: normalizedId };
		},
	},
};
