import { sqlite } from "src";

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS alive_message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
  )
`);

export default {
	set: (message: string) => {
		const exists = sqlite
			.query("SELECT 1 FROM alive_message WHERE id = ?")
			.get(1);

		if (exists) {
			sqlite.run("UPDATE alive_message SET message = ? WHERE id = ?", [
				message,
				1,
			]);
			return {
				changes: (
					sqlite.query("SELECT changes() AS changes").get() as {
						changes: number;
					}
				).changes,
			};
		}

		sqlite.run("INSERT INTO alive_message (message) VALUES (?)", [message]);
		return {
			changes: (
				sqlite.query("SELECT changes() AS changes").get() as { changes: number }
			).changes,
		};
	},

	get: () => {
		const result = sqlite
			.query("SELECT message FROM alive_message WHERE id = ?")
			.get(1) as { message?: string } | null;
		return result?.message ?? "_I am alive_";
	},

	del: () => {
		const exists = sqlite
			.query("SELECT 1 FROM alive_message WHERE id = ?")
			.get(1);
		if (exists) {
			sqlite.run("DELETE FROM alive_message WHERE id = ?", [1]);
			return {
				changes: (
					sqlite.query("SELECT changes() AS changes").get() as {
						changes: number;
					}
				).changes,
			};
		}
		return;
	},
};
