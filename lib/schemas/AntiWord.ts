import database from "../lib/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS antiword (
	jid TEXT PRIMARY KEY,
	status INTEGER,
	words TEXT
	)
`);

export function setAntiWord(jid: string, status: boolean, words: string[]) {
	const badWords = Array.from(new Set(words));
	const mode = status ? 1 : 0;
	const existing = database
		.query("SELECT 1 FROM antiword WHERE jid = ?")
		.get(jid);

	if (existing) {
		database.run("UPDATE antiword SET status = ?, words = ? WHERE jid = ?", [
			mode,
			JSON.stringify(badWords),
			jid,
		]);
	} else {
		database.run("INSERT INTO antiword (jid, status, words) VALUES (?, ?, ?)", [
			jid,
			mode,
			JSON.stringify(badWords),
		]);
	}

	return { enabled: true, words: badWords.length };
}

export function delAntiword(jid: string) {
	database.run("DELETE FROM antiword WHERE jid = ?", [jid]);
	const result = database.query("SELECT changes() AS changes").get() as {
		changes: number;
	};
	return result.changes > 0;
}

export function getAntiword(jid: string) {
	const record = database
		.query("SELECT jid, status, words FROM antiword WHERE jid = ?")
		.get(jid) as {
		jid: string;
		status: number | null;
		words: string | null;
	} | null;

	if (!record) return null;

	return {
		jid: record.jid,
		status: record.status != null ? Boolean(record.status) : null,
		words: record.words ? JSON.parse(record.words) : [],
	};
}
