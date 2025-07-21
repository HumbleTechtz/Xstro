import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class Settings extends Model {
	declare id: number;
	declare prefix: string;
	declare mode: number;
	declare autoLikeStatus: number;
}

await Settings.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		prefix: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: '["."]',
		},
		mode: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		autoLikeStatus: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		tableName: "settings",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

function transformRecord(record: Settings) {
	return {
		prefix: JSON.parse(record.prefix),
		mode: Boolean(record.mode),
		autoLikeStatus: Boolean(record.autoLikeStatus),
	};
}

export default {
	prefix: {
		set: async (payload: string[]) => {
			const record = await Settings.findByPk(1);
			if (!record) {
				await Settings.create({
					id: 1,
					prefix: JSON.stringify(payload),
					mode: 1,
					autoLikeStatus: 0,
				});
				return { prefix: payload, mode: true, autoLikeStatus: false };
			}

			const { prefix, mode, autoLikeStatus } = transformRecord(record);
			const updated = Array.from(new Set([...prefix, ...payload]));

			record.prefix = JSON.stringify(updated);
			await record.save();

			return { prefix: updated, mode, autoLikeStatus };
		},

		get: async () => {
			const record = await Settings.findByPk(1);
			if (!record) return ["."];
			return JSON.parse(record.prefix);
		},

		del: async () => {
			const record = await Settings.findByPk(1);
			if (!record) return { prefix: ["."], mode: true, autoLikeStatus: false };

			const { mode, autoLikeStatus } = transformRecord(record);
			const defaultPrefix = ["."];
			record.prefix = JSON.stringify(defaultPrefix);
			await record.save();

			return { prefix: defaultPrefix, mode, autoLikeStatus };
		},
	},

	mode: {
		set: async (mode: boolean) => {
			const record = await Settings.findByPk(1);
			if (!record) {
				await Settings.create({
					id: 1,
					prefix: '["."]',
					mode: mode ? 1 : 0,
					autoLikeStatus: 0,
				});
				return { prefix: ["."], mode, autoLikeStatus: false };
			}

			const { prefix, autoLikeStatus } = transformRecord(record);
			record.mode = mode ? 1 : 0;
			await record.save();

			return { prefix, mode, autoLikeStatus };
		},

		get: async () => {
			const record = await Settings.findByPk(1);
			if (!record) return true;
			return Boolean(record.mode);
		},

		del: async () => {
			const record = await Settings.findByPk(1);
			if (!record) return { prefix: ["."], mode: true, autoLikeStatus: false };

			const { prefix, autoLikeStatus } = transformRecord(record);
			const defaultMode = true;

			record.mode = defaultMode ? 1 : 0;
			await record.save();

			return { prefix, mode: defaultMode, autoLikeStatus };
		},
	},

	autoLikeStatus: {
		set: async (status: boolean) => {
			const record = await Settings.findByPk(1);
			if (!record) {
				await Settings.create({
					id: 1,
					prefix: '["."]',
					mode: 1,
					autoLikeStatus: status ? 1 : 0,
				});
				return { prefix: ["."], mode: true, autoLikeStatus: status };
			}

			const { prefix, mode } = transformRecord(record);
			record.autoLikeStatus = status ? 1 : 0;
			await record.save();

			return { prefix, mode, autoLikeStatus: status };
		},

		get: async () => {
			const record = await Settings.findByPk(1);
			if (!record) return false;
			return Boolean(record.autoLikeStatus);
		},

		del: async () => {
			const record = await Settings.findByPk(1);
			if (!record) return { prefix: ["."], mode: true, autoLikeStatus: false };

			const { prefix, mode } = transformRecord(record);
			const defaultAutoLikeStatus = false;

			record.autoLikeStatus = defaultAutoLikeStatus ? 1 : 0;
			await record.save();

			return { prefix, mode, autoLikeStatus: defaultAutoLikeStatus };
		},
	},

	get: async () => {
		let record = await Settings.findByPk(1);

		if (!record) {
			await Settings.create({
				id: 1,
				prefix: '["."]',
				mode: 1,
				autoLikeStatus: 0,
			});
			record = await Settings.findByPk(1);
		}

		return transformRecord(record!);
	},
};
