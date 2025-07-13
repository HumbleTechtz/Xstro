import { isJidUser, isLidUser } from "baileys";
import { sqlite } from "src";

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS sudo_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jid TEXT UNIQUE,
    lid TEXT
  )
`);

export default {
	add: (jid: string, lid: string) => {
		if (!isJidUser(jid) || !isLidUser(lid)) return;
		const exists = sqlite.query("SELECT 1 FROM sudo_user WHERE jid = ?").get(jid);
		if (!exists) {
			sqlite.run("INSERT INTO sudo_user (jid, lid) VALUES (?, ?)", [jid, lid]);
		}
	},

	list: (sudoType: "jid" | "lid") => {
		const users = sqlite
			.query(`SELECT ${sudoType} FROM sudo_user WHERE ${sudoType} IS NOT NULL`)
			.all() as Array<{ [key: string]: string }>;
		return users
			.map(user => user[sudoType])
			.filter((value): value is string => value != null);
	},

	remove: (user: string) => {
		let field: "jid" | "lid" | undefined;

		if (isJidUser(user)) field = "jid";
		else if (isLidUser(user)) field = "lid";

		if (!field) return;

		sqlite.run(`DELETE FROM sudo_user WHERE ${field} = ?`, [user]);
	},

	check: (user: string) => {
		let field: "jid" | "lid" | undefined;

		if (isJidUser(user)) field = "jid";
		else if (isLidUser(user)) field = "lid";

		if (!field) return false;

		const exists = sqlite
			.query(`SELECT 1 FROM sudo_user WHERE ${field} = ?`)
			.get(user);
		return !!exists;
	},
};
