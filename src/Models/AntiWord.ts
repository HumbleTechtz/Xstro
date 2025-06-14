import database from "../Core/database.ts";

database.exec(`
  CREATE TABLE IF NOT EXISTS antiword (
    jid TEXT PRIMARY KEY,
    status INTEGER,
    words TEXT
  )
`);

export async function setAntiWord(
	jid: string,
	status: boolean,
	words: string[]
): Promise<
	| {
			enabled: boolean;
			words: number;
	  }
	| undefined
> {
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

export async function delAntiword(jid: string): Promise<boolean> {
	database.run("DELETE FROM antiword WHERE jid = ?", [jid]);
	const result = database.query("SELECT changes() AS changes").get() as {
		changes: number;
	};
	return result.changes > 0;
}

export async function getAntiword(jid: string): Promise<{
	jid: string;
	status: boolean | null;
	words: string[] | null;
} | null> {
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
