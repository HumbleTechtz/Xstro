import database from "../Core/database.ts";

database.exec(`
  CREATE TABLE IF NOT EXISTS group_join (
    groupJid TEXT PRIMARY KEY,
    welcome TEXT,
    goodbye TEXT
  )
`);

export async function setWelcome(id: string, text: string): Promise<void> {
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

export async function setGoodBye(id: string, text: string): Promise<void> {
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

export async function getWelcome(id: string): Promise<string | null> {
	const data = database
		.query("SELECT welcome FROM group_join WHERE groupJid = ?")
		.get(id) as {
		groupJid: string;
		welcome: string | null;
		goodbye: string | null;
	} | null;
	return data?.welcome ?? null;
}

export async function getGoodBye(id: string): Promise<string | null> {
	const data = database
		.query("SELECT goodbye FROM group_join WHERE groupJid = ?")
		.get(id) as {
		groupJid: string;
		welcome: string | null;
		goodbye: string | null;
	} | null;
	return data?.goodbye ?? null;
}

export async function delWelcome(id: string): Promise<void> {
	database.run("UPDATE group_join SET welcome = NULL WHERE groupJid = ?", [id]);
}

export async function delGoodBye(id: string): Promise<void> {
	database.run("UPDATE group_join SET goodbye = NULL WHERE groupJid = ?", [id]);
}
