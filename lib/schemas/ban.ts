import database from "../lib/database";
import { isJidUser, isLidUser } from "baileys";

database.exec(`
	CREATE TABLE IF NOT EXISTS ban_user (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	jid TEXT UNIQUE,
	lid TEXT
	)
`);

export const setBan = (jid: string, lid: string) => {
	if (!isJidUser(jid) || !isLidUser(lid)) return;
	const exists = database.query("SELECT 1 FROM ban_user WHERE jid = ?").get(jid);
	if (!exists) {
		database.run("INSERT INTO ban_user (jid, lid) VALUES (?, ?)", [jid, lid]);
	}
};

export const getBan = (banType: "jid" | "lid" = "jid") => {
	const users = database
		.query(`SELECT ${banType} FROM ban_user WHERE ${banType} IS NOT NULL`)
		.all() as Array<{ [key: string]: string }>;
	return users
		.map(user => user[banType])
		.filter((value): value is string => value != null);
};

export const delBan = (user: string) => {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return;

	database.run(`DELETE FROM ban_user WHERE ${field} = ?`, [user]);
};

export const isBanned = (user: string) => {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return false;

	const exists = database
		.query(`SELECT 1 FROM ban_user WHERE ${field} = ?`)
		.get(user);
	return !!exists;
};
