import database from "../Core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS group_event (
	groupJid TEXT PRIMARY KEY,
	mode INTEGER
	)
`);

export async function setGroupEvent(id: string, mode: boolean): Promise<void> {
	const opt = mode ? 1 : 0;
	const exists = database
		.query("SELECT 1 FROM group_event WHERE groupJid = ?")
		.get(id);

	if (exists) {
		database.run("UPDATE group_event SET mode = ? WHERE groupJid = ?", [
			opt,
			id,
		]);
	} else {
		database.run("INSERT INTO group_event (groupJid, mode) VALUES (?, ?)", [
			id,
			opt,
		]);
	}
}

export async function getGroupEvent(id: string): Promise<boolean> {
	const entry = database
		.query("SELECT mode FROM group_event WHERE groupJid = ?")
		.get(id) as {
		groupJid: string;
		mode: number | null;
	} | null;
	return !!(entry && entry.mode);
}

export async function delGroupEvent(id: string): Promise<void> {
	database.run("DELETE FROM group_event WHERE groupJid = ?", [id]);
}
