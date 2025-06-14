import database from "../Core/database.ts";

database.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    prefix TEXT NOT NULL DEFAULT '["."]',
    mode INTEGER NOT NULL DEFAULT 1
  )
`);

export async function getSettings(): Promise<{
	prefix: string[];
	mode: boolean;
}> {
	let config = database
		.query("SELECT prefix, mode FROM settings WHERE id = ?")
		.get(1) as {
		id: number;
		prefix: string;
		mode: number;
	} | null;

	if (!config) {
		database.run("INSERT INTO settings (id, prefix, mode) VALUES (?, ?, ?)", [
			1,
			JSON.stringify(["."]),
			1,
		]);
		config = database
			.query("SELECT prefix, mode FROM settings WHERE id = ?")
			.get(1) as {
			id: number;
			prefix: string;
			mode: number;
		};
	}

	return {
		prefix: JSON.parse(config.prefix),
		mode: Boolean(config.mode),
	};
}

export async function setPrefix(payload: string[]): Promise<void> {
	const { prefix, mode } = await getSettings();
	const updated = Array.from(new Set([...prefix, ...payload]));
	database.run("UPDATE settings SET prefix = ? WHERE id = ?", [
		JSON.stringify(updated),
		1,
	]);
}

export async function setMode(mode: boolean): Promise<void> {
	const { prefix } = await getSettings();
	database.run("UPDATE settings SET mode = ?, prefix = ? WHERE id = ?", [
		mode ? 1 : 0,
		JSON.stringify(prefix),
		1,
	]);
}

export async function getPrefix(): Promise<string[]> {
	const config = database
		.query("SELECT prefix FROM settings WHERE id = ?")
		.get(1) as {
		id: number;
		prefix: string;
		mode: number;
	} | null;
	return config?.prefix ? JSON.parse(config.prefix) : ["."];
}

export async function getMode(): Promise<boolean> {
	const config = database
		.query("SELECT mode FROM settings WHERE id = ?")
		.get(1) as {
		id: number;
		prefix: string;
		mode: number;
	} | null;
	return config ? Boolean(config.mode) : true;
}
