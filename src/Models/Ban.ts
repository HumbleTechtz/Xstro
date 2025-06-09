import { DataTypes } from "quantava";
import database from "../Core/database.ts";
import { isJidUser, isLidUser } from "baileys";

const Ban = database.define("ban_user", {
	id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	jid: { type: DataTypes.STRING, unique: true },
	lid: { type: DataTypes.STRING },
});

export const setBan = async (jid: string, lid: string) => {
	if (!isJidUser(jid) || !isLidUser(lid)) return;
	const exists = await Ban.findOne({ where: { jid } });
	if (!exists) {
		return await Ban.create({ jid, lid });
	}
	return;
};

export const getBan = async (
	banType: "jid" | "lid" = "jid",
): Promise<string[]> => {
	const users = (await Ban.findAll({
		attributes: [banType],
	})) as any;
	return users.map((user: any) => user[banType]);
};

export const delBan = async (user: string) => {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return;

	const exists = await Ban.findOne({ where: { [field]: user } });
	if (!exists) return;

	await Ban.destroy({ where: { [field]: user } });
};

export const isBanned = async (user: string): Promise<boolean> => {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return false;

	const exists = await Ban.findOne({ where: { [field]: user } });
	return !!exists;
};
