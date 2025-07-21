import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";

class StickerCmd extends Model {
	declare filesha256: string;
	declare cmdname: string | null;
}

await StickerCmd.init(
	{
		filesha256: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		cmdname: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: "sticker_cmd",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	get: async (filesha256: string): Promise<{ cmdname?: string } | undefined> => {
		const record = await StickerCmd.findByPk(filesha256);
		if (!record) return undefined;
		return record.get({ plain: true });
	},

	set: async (filesha256: string, cmdname: string): Promise<void> => {
		await StickerCmd.upsert({ filesha256, cmdname });
	},

	remove: async (cmdname: string): Promise<boolean | undefined> => {
		const record = await StickerCmd.findOne({ where: { cmdname } });
		if (!record) return undefined;
		await record.destroy();
		return true;
	},
};
