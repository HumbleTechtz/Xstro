import database from "../Core/database.ts";

database.exec(`
  CREATE TABLE IF NOT EXISTS ratelimiter (
    sender TEXT PRIMARY KEY,
    request_count INTEGER NOT NULL DEFAULT 0,
    last_request_date TEXT NOT NULL
  )
`);

function getTodayDate(): string {
	return new Date().toISOString().split("T")[0];
}

export async function canProceed(sender: string): Promise<boolean> {
	const today = getTodayDate();
	const record = database
		.query(
			"SELECT request_count, last_request_date FROM ratelimiter WHERE sender = ?"
		)
		.get(sender) as {
		sender: string;
		request_count: number;
		last_request_date: string;
	} | null;

	if (!record) {
		database.run(
			"INSERT INTO ratelimiter (sender, request_count, last_request_date) VALUES (?, ?, ?)",
			[sender, 1, today]
		);
		return true;
	}

	if (record.last_request_date !== today) {
		database.run(
			"UPDATE ratelimiter SET request_count = ?, last_request_date = ? WHERE sender = ?",
			[1, today, sender]
		);
		return true;
	}

	if (record.request_count >= 10) return false;

	database.run("UPDATE ratelimiter SET request_count = ? WHERE sender = ?", [
		record.request_count + 1,
		sender,
	]);
	return true;
}

export async function resetAllLimits(): Promise<void> {
	const today = getTodayDate();
	const users = database
		.query("SELECT sender, request_count, last_request_date FROM ratelimiter")
		.all() as {
		sender: string;
		request_count: number;
		last_request_date: string;
	}[];

	for (const user of users) {
		database.run(
			"UPDATE ratelimiter SET request_count = ?, last_request_date = ? WHERE sender = ?",
			[0, today, user.sender]
		);
	}
}

export async function getRemainingQuota(sender: string): Promise<number> {
	const today = getTodayDate();
	const record = database
		.query(
			"SELECT request_count, last_request_date FROM ratelimiter WHERE sender = ?"
		)
		.get(sender) as {
		sender: string;
		request_count: number;
		last_request_date: string;
	} | null;
	if (!record || record.last_request_date !== today) return 10;
	return Math.max(0, 10 - record.request_count);
}

export async function resetIfExpired(): Promise<void> {
	const users = database
		.query("SELECT sender, request_count, last_request_date FROM ratelimiter")
		.all() as {
		sender: string;
		request_count: number;
		last_request_date: string;
	}[];
	const now = Date.now();

	for (const user of users) {
		const last = new Date(user.last_request_date).getTime();
		const hours = (now - last) / (1000 * 60 * 60);

		if (hours >= 24) {
			database.run(
				"UPDATE ratelimiter SET request_count = ?, last_request_date = ? WHERE sender = ?",
				[0, new Date().toISOString(), user.sender]
			);
		}
	}
}
