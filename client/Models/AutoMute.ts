import database from "../Core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS automute (
	jid TEXT PRIMARY KEY,
	startTime TEXT,
	endTime TEXT
	)
`);

export async function setAutoMute(
	jid: string,
	startTime: string,
	endTime?: string
): Promise<boolean> {
	const existing = database
		.query("SELECT 1 FROM automute WHERE jid = ?")
		.get(jid);

	if (existing) {
		database.run(
			"UPDATE automute SET startTime = ?, endTime = ? WHERE jid = ?",
			[startTime, endTime ?? null, jid]
		);
	} else {
		database.run(
			"INSERT INTO automute (jid, startTime, endTime) VALUES (?, ?, ?)",
			[jid, startTime, endTime ?? null]
		);
	}

	return true;
}

export async function delAutoMute(jid: string): Promise<number> {
	database.run("DELETE FROM automute WHERE jid = ?", [jid]);
	const result = database.query("SELECT changes() AS changes").get();
	if (result && typeof result === "object" && "changes" in result) {
		return (result as { changes: number }).changes;
	}
	return 0;
}

export async function getAutoMute(jid: string): Promise<{
	jid: string;
	startTime: string | null;
	endTime: string | null;
} | null> {
	const result = database
		.query("SELECT jid, startTime, endTime FROM automute WHERE jid = ?")
		.get(jid) as {
		jid: string;
		startTime: string | null;
		endTime: string | null;
	} | null;
	return result ?? null;
}
