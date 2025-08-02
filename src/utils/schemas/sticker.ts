import { DataTypes } from 'sequelize';
import database from '../../database.ts';

const StickerCmd = database.define('sticker_cmd', {
	filesha256: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	cmdname: {
		type: DataTypes.STRING,
		allowNull: true,
	},
}, {
	timestamps: false,
	tableName: 'sticker_cmd',
});

await StickerCmd.sync();

export const Sticker = {
	async get(filesha256: string): Promise<{ filesha256: string; cmdname: string | null } | undefined> {
		const record = await StickerCmd.findByPk(filesha256);
		return record?.toJSON() as { filesha256: string; cmdname: string | null } | undefined;
	},

	async set(filesha256: string, cmdname: string): Promise<void> {
		const [record, created] = await StickerCmd.findOrCreate({
			where: { filesha256 },
			defaults: { cmdname },
		});

		if (!created) {
			await record.update({ cmdname });
		}
	},

	async del(cmdname: string): Promise<boolean | undefined> {
		const record = await StickerCmd.findOne({ where: { cmdname } });
		if (!record) return undefined;

		await record.destroy();
		return true;
	},
};
