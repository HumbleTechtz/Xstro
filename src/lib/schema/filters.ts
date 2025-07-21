import { DataTypes, Model, Op } from "sequelize";
import sqlite from "../../sqlite.ts";

class Filter extends Model {
	declare name: string;
	declare response: string | null;
	declare status: number;
	declare isGroup: number | null;
}

await Filter.init(
	{
		name: {
			type: DataTypes.TEXT,
			primaryKey: true,
			unique: true,
			allowNull: false,
		},
		response: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		isGroup: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{
		tableName: "filters",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

function transformRecord(record: Filter) {
	return {
		name: record.name,
		response: record.response || null,
		status: Boolean(record.status),
		isGroup: record.isGroup != null ? Boolean(record.isGroup) : null,
	};
}

export default {
	set: async (
		name: string,
		response: string,
		status: boolean,
		isGroup = false
	) => {
		const normalizedName = name.trim().toLowerCase();
		const params = {
			response,
			status: status ? 1 : 0,
			isGroup: isGroup ? 1 : 0,
		};

		const existing = await Filter.findByPk(normalizedName);
		if (existing) {
			existing.response = params.response;
			existing.status = params.status;
			existing.isGroup = params.isGroup;
			await existing.save();
		} else {
			await Filter.create({ name: normalizedName, ...params });
		}

		return { name: normalizedName, ...params };
	},

	get: async (name: string) => {
		const normalizedName = name.trim().toLowerCase();
		const record = await Filter.findByPk(normalizedName);
		return record ? transformRecord(record) : null;
	},

	getAll: async () => {
		const records = await Filter.findAll({ where: { status: 1 } });
		return records.map(transformRecord);
	},

	getActive: async (isGroup?: boolean) => {
		const where: any = { status: 1 };
		if (isGroup !== undefined) where.isGroup = isGroup ? 1 : 0;

		const records = await Filter.findAll({ where });
		return records.map(transformRecord);
	},

	remove: async (name: string) => {
		const normalizedName = name.trim().toLowerCase();
		const deleted = await Filter.destroy({ where: { name: normalizedName } });
		return { success: deleted > 0, name: normalizedName };
	},

	toggle: async (name: string, status?: boolean) => {
		const normalizedName = name.trim().toLowerCase();
		const record = await Filter.findByPk(normalizedName);
		if (!record) return null;

		const newStatus = status !== undefined ? status : !Boolean(record.status);
		record.status = newStatus ? 1 : 0;
		await record.save();

		return { name: normalizedName, status: newStatus };
	},
};
