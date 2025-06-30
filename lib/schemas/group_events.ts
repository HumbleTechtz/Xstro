import database from "../client/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS group_event (
	groupJid TEXT PRIMARY KEY,
	mode INTEGER
	)
`);

export function setGroupEvent(id: string, mode: boolean) {
	const opt = mode ? 1 : 0;
	const exists = database
		.query("SELECT 1 FROM group_event WHERE groupJid = ?")
		.get(id);

	if (exists) {
		database.run("UPDATE group_event SET mode = ? WHERE groupJid = ?", [opt, id]);
	} else {
		database.run("INSERT INTO group_event (groupJid, mode) VALUES (?, ?)", [
			id,
			opt,
		]);
	}
}

export function getGroupEvent(id: string) {
	const entry = database
		.query("SELECT mode FROM group_event WHERE groupJid = ?")
		.get(id) as {
		groupJid: string;
		mode: number | null;
	} | null;
	return !!(entry && entry.mode);
}

export function delGroupEvent(id: string) {
	database.run("DELETE FROM group_event WHERE groupJid = ?", [id]);
}
