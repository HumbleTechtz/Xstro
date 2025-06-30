import database from "../core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS settings (
	id INTEGER PRIMARY KEY,
	prefix TEXT NOT NULL DEFAULT '["."]',
	mode INTEGER NOT NULL DEFAULT 1,
	autoLikeStatus INTEGER NOT NULL DEFAULT 0
	)
`);

export function getSettings(): {
	prefix: string[];
	mode: boolean;
	autoLikeStatus: boolean;
} {
	let config = database
		.query("SELECT prefix, mode, autoLikeStatus FROM settings WHERE id = ?")
		.get(1) as {
		id: number;
		prefix: string;
		mode: number;
		autoLikeStatus: number;
	} | null;

	if (!config) {
		database.run(
			"INSERT INTO settings (id, prefix, mode, autoLikeStatus) VALUES (?, ?, ?, ?)",
			[1, JSON.stringify(["."]), 1, 0]
		);
		config = database
			.query("SELECT prefix, mode, autoLikeStatus FROM settings WHERE id = ?")
			.get(1) as {
			id: number;
			prefix: string;
			mode: number;
			autoLikeStatus: number;
		};
	}

	return {
		prefix: JSON.parse(config.prefix),
		mode: Boolean(config.mode),
		autoLikeStatus: Boolean(config.autoLikeStatus),
	};
}

export function setPrefix(payload: string[]) {
	const { prefix, mode, autoLikeStatus } = getSettings();
	const updated = Array.from(new Set([...prefix, ...payload]));
	database.run(
		"UPDATE settings SET prefix = ?, mode = ?, autoLikeStatus = ? WHERE id = ?",
		[JSON.stringify(updated), mode ? 1 : 0, autoLikeStatus ? 1 : 0, 1]
	);
}

export function setMode(mode: boolean) {
	const { prefix, autoLikeStatus } = getSettings();
	database.run(
		"UPDATE settings SET mode = ?, prefix = ?, autoLikeStatus = ? WHERE id = ?",
		[mode ? 1 : 0, JSON.stringify(prefix), autoLikeStatus ? 1 : 0, 1]
	);
}

export function setAutoLikeStatus(status: boolean) {
	const { prefix, mode } = getSettings();
	database.run(
		"UPDATE settings SET prefix = ?, mode = ?, autoLikeStatus = ? WHERE id = ?",
		[JSON.stringify(prefix), mode ? 1 : 0, status ? 1 : 0, 1]
	);
}

export function getPrefix(): string[] {
	const config = database
		.query("SELECT prefix FROM settings WHERE id = ?")
		.get(1) as {
		id: number;
		prefix: string;
		mode: number;
		autoLikeStatus: number;
	} | null;
	return config?.prefix ? JSON.parse(config.prefix) : ["."];
}

export function getMode() {
	const config = database
		.query("SELECT mode FROM settings WHERE id = ?")
		.get(1) as {
		id: number;
		prefix: string;
		mode: number;
		autoLikeStatus: number;
	} | null;
	return config ? Boolean(config.mode) : true;
}

export function getAutoLikeStatus() {
	const config = database
		.query("SELECT autoLikeStatus FROM settings WHERE id = ?")
		.get(1) as {
		id: number;
		prefix: string;
		mode: number;
		autoLikeStatus: number;
	} | null;
	return config ? Boolean(config.autoLikeStatus) : false;
}
