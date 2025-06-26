import database from "../Core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS group_join (
	groupJid TEXT PRIMARY KEY,
	welcome TEXT,
	goodbye TEXT
	)
`);

export function setWelcome(id: string, text: string) {
	const exists = database
		.query("SELECT 1 FROM group_join WHERE groupJid = ?")
		.get(id);
	if (exists) {
		database.run("UPDATE group_join SET welcome = ? WHERE groupJid = ?", [
			text,
			id,
		]);
	} else {
		database.run("INSERT INTO group_join (groupJid, welcome) VALUES (?, ?)", [
			id,
			text,
		]);
	}
}

export function setGoodBye(id: string, text: string) {
	const exists = database
		.query("SELECT 1 FROM group_join WHERE groupJid = ?")
		.get(id);
	if (exists) {
		database.run("UPDATE group_join SET goodbye = ? WHERE groupJid = ?", [
			text,
			id,
		]);
	} else {
		database.run("INSERT INTO group_join (groupJid, goodbye) VALUES (?, ?)", [
			id,
			text,
		]);
	}
}

export function getWelcome(id: string) {
	const data = database
		.query("SELECT welcome FROM group_join WHERE groupJid = ?")
		.get(id) as {
		groupJid: string;
		welcome: string | null;
		goodbye: string | null;
	} | null;
	return data?.welcome ?? null;
}

export function getGoodBye(id: string) {
	const data = database
		.query("SELECT goodbye FROM group_join WHERE groupJid = ?")
		.get(id) as {
		groupJid: string;
		welcome: string | null;
		goodbye: string | null;
	} | null;
	return data?.goodbye ?? null;
}

export function delWelcome(id: string) {
	database.run("UPDATE group_join SET welcome = NULL WHERE groupJid = ?", [id]);
}

export function delGoodBye(id: string) {
	database.run("UPDATE group_join SET goodbye = NULL WHERE groupJid = ?", [id]);
}
