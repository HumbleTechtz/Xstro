import database from "../Core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS anticall (
	mode INTEGER,
	action TEXT NOT NULL
	)
`);

export const getAntiCall = () => {
	const record = database
		.query("SELECT mode, action FROM anticall LIMIT 1")
		.get() as { mode: number | null; action: string } | null;
	if (record) {
		return {
			mode: record.mode != null ? Boolean(record.mode) : null,
			action: record.action as "block" | "warn",
		};
	}
	return null;
};

export const setAntiCall = (mode: boolean, action: "block" | "warn") => {
	const current = getAntiCall();
	if (current && current.mode === mode && current.action === action) {
		return false;
	}
	database.run("DELETE FROM anticall WHERE mode = ?", [current?.mode ? 1 : 0]);
	database.run("INSERT INTO anticall (mode, action) VALUES (?, ?)", [
		mode ? 1 : 0,
		action,
	]);
	return true;
};

export const delAntiCall = () => {
	database.run("DELETE FROM anticall");
	const result = database.query("SELECT changes() AS changes").get();
	return result && typeof result === "object" && "changes" in result
		? (result as { changes: number }).changes
		: 0;
};
