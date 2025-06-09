import { DataTypes } from "quantava";
import database from "../Core/database.ts";
import { isJidUser, isLidUser } from "baileys";

const Sudo = database.define("sudo_user", {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	jid: { type: DataTypes.STRING, unique: true },
	lid: { type: DataTypes.STRING },
});

export const SetSudo = async (jid: string, lid: string) => {
	if (!isJidUser(jid) || !isLidUser(lid)) return;
	const exists = await Sudo.findOne({ where: { jid } });
	if (!exists) {
		return await Sudo.create({ jid, lid });
	}
	return;
};

export const getSudo = async (sudoType: "jid" | "lid"): Promise<string[]> => {
	const users = (await Sudo.findAll({
		attributes: [sudoType],
	})) as any;
	return users.map((user: any) => user[sudoType]);
};

export const delSudo = async (user: string) => {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return;

	const exists = await Sudo.findOne({ where: { [field]: user } });
	if (!exists) return;

	await Sudo.destroy({ where: { [field]: user } });
};

export const isSudo = async (user: string) => {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return false;
	const exists = await Sudo.findOne({ where: { [field]: user } });
	return !!exists;
};
