import database from "../lib/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS antilink (
	jid TEXT NOT NULL UNIQUE,
	mode INTEGER,
	links TEXT
	)
`);

export const setAntilink = (jid: string, mode: boolean, links?: string[]) => {
	const existing = database
		.query("SELECT 1 FROM antilink WHERE jid = ?")
		.get(jid);

	if (existing) {
		database.run("UPDATE antilink SET mode = ?, links = ? WHERE jid = ?", [
			mode ? 1 : 0,
			links ? JSON.stringify(links) : null,
			jid,
		]);
	} else {
		database.run("INSERT INTO antilink (jid, mode, links) VALUES (?, ?, ?)", [
			jid,
			mode ? 1 : 0,
			links ? JSON.stringify(links) : null,
		]);
	}
};

export const getAntilink = (jid: string) => {
	const record = database
		.query("SELECT jid, mode, links FROM antilink WHERE jid = ?")
		.get(jid) as {
		jid: string;
		mode: number | null;
		links: string | null;
	} | null;

	if (!record) return null;

	return {
		jid: record.jid,
		mode: record.mode != null ? Boolean(record.mode) : null,
		links: record.links ? JSON.parse(record.links) : [],
	};
};

export const delAntilink = (jid: string) => {
	database.run("DELETE FROM antilink WHERE jid = ?", [jid]);
};
