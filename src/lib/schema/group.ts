import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class GroupEvent extends Model {
	declare groupJid: string;
	declare mode: number;
}

await GroupEvent.init(
	{
		groupJid: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false,
		},
		mode: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		tableName: "group_event",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	set: async (groupJid: string, enabled: boolean) => {
		const mode = enabled ? 1 : 0;
		const existing = await GroupEvent.findByPk(groupJid);

		if (existing) {
			existing.mode = mode;
			await existing.save();
		} else {
			await GroupEvent.create({ groupJid, mode });
		}

		return { groupJid, enabled };
	},

	get: async (groupJid: string) => {
		const record = await GroupEvent.findByPk(groupJid);
		return record ? Boolean(record.mode) : false;
	},

	remove: async (groupJid: string) => {
		const deleted = await GroupEvent.destroy({ where: { groupJid } });
		return { success: deleted > 0, groupJid };
	},

	list: async (enabled?: boolean) => {
		const where = enabled === undefined ? undefined : { mode: enabled ? 1 : 0 };
		const rows = await GroupEvent.findAll({ where });
		return rows.map(r => ({ groupJid: r.groupJid, enabled: Boolean(r.mode) }));
	},

	toggle: async (groupJid: string) => {
		const record = await GroupEvent.findByPk(groupJid);

		if (!record) {
			await GroupEvent.create({ groupJid, mode: 1 });
			return { groupJid, enabled: true };
		}

		record.mode = record.mode ? 0 : 1;
		await record.save();

		return { groupJid, enabled: Boolean(record.mode) };
	},
};
