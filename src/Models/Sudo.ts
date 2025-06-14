import database from "../Core/database.ts";
import { isJidUser, isLidUser } from "baileys";

database.exec(`
  CREATE TABLE IF NOT EXISTS sudo_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jid TEXT UNIQUE,
    lid TEXT
  )
`);

export async function SetSudo(jid: string, lid: string): Promise<void> {
	if (!isJidUser(jid) || !isLidUser(lid)) return;
	const exists = database
		.query("SELECT 1 FROM sudo_user WHERE jid = ?")
		.get(jid);
	if (!exists) {
		database.run("INSERT INTO sudo_user (jid, lid) VALUES (?, ?)", [jid, lid]);
	}
}

export async function getSudo(sudoType: "jid" | "lid"): Promise<string[]> {
	const users = database
		.query(`SELECT ${sudoType} FROM sudo_user WHERE ${sudoType} IS NOT NULL`)
		.all() as Array<{ [key: string]: string }>;
	return users
		.map(user => user[sudoType])
		.filter((value): value is string => value != null);
}

export async function delSudo(user: string): Promise<void> {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return;

	database.run(`DELETE FROM sudo_user WHERE ${field} = ?`, [user]);
}

export async function isSudo(user: string): Promise<boolean> {
	let field: "jid" | "lid" | undefined;

	if (isJidUser(user)) field = "jid";
	else if (isLidUser(user)) field = "lid";

	if (!field) return false;

	const exists = database
		.query(`SELECT 1 FROM sudo_user WHERE ${field} = ?`)
		.get(user);
	return !!exists;
}
