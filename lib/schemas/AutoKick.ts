import database from "../lib/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS autokick (
	groupJid TEXT PRIMARY KEY,
	jid TEXT,
	lid TEXT
	)
`);

export function addAutoKick(
	groupJid: string,
	jid: string | null,
	lid: string | null
) {
	const entry = database
		.query("SELECT groupJid, jid, lid FROM autokick WHERE groupJid = ?")
		.get(groupJid) as { groupJid: string; jid: string; lid: string } | null;

	if (entry) {
		database.run("UPDATE autokick SET jid = ?, lid = ? WHERE groupJid = ?", [
			jid,
			lid,
			groupJid,
		]);
	} else {
		database.run("INSERT INTO autokick (groupJid, jid, lid) VALUES (?, ?, ?)", [
			groupJid,
			jid,
			lid,
		]);
	}
}

export function getAutoKick(groupJid: string, id: string) {
	const entry = database
		.query("SELECT jid, lid FROM autokick WHERE groupJid = ?")
		.get(groupJid) as { groupJid: string; jid: string; lid: string } | null;

	if (!entry) return false;

	return entry.jid === id || entry.lid === id;
}

export function delAutoKick(groupJid: string) {
	database.run("DELETE FROM autokick WHERE groupJid = ?", [groupJid]);
}

export function getAllAutoKicks() {
	return database.query("SELECT groupJid, jid, lid FROM autokick").all() as {
		groupJid: string;
		jid: string;
		lid: string;
	}[];
}
