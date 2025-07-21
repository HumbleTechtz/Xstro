import { isJidUser, isLidUser } from "baileys";
import { DataTypes, Model, Op } from "sequelize";
import sqlite from "../../sqlite.ts";

class SudoUser extends Model {
	declare id: number;
	declare jid: string | null;
	declare lid: string | null;
}

await SudoUser.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		jid: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true,
		},
		lid: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: "sudo_user",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	add: async (jid: string, lid: string) => {
		if (!isJidUser(jid) || !isLidUser(lid)) return;
		const exists = await SudoUser.findOne({ where: { jid } });
		if (!exists) {
			await SudoUser.create({ jid, lid });
		}
	},

	list: async (sudoType: "jid" | "lid") => {
		const users = await SudoUser.findAll({
			where: {
				[sudoType]: { [Op.ne]: null },
			},
			attributes: [sudoType],
		});
		return users
			.map(user => user.getDataValue(sudoType))
			.filter(Boolean) as string[];
	},

	remove: async (user: string) => {
		let field: "jid" | "lid" | undefined;

		if (isJidUser(user)) field = "jid";
		else if (isLidUser(user)) field = "lid";

		if (!field) return;

		await SudoUser.destroy({ where: { [field]: user } });
	},

	check: async (user: string) => {
		let field: "jid" | "lid" | undefined;

		if (isJidUser(user)) field = "jid";
		else if (isLidUser(user)) field = "lid";

		if (!field) return false;

		const exists = await SudoUser.findOne({ where: { [field]: user } });
		return !!exists;
	},
};
