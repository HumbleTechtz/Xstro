import database from "../client/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS alive_message (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	message TEXT NOT NULL
	)
`);

export const SetAlive = (message: string) => {
	const exists = database
		.query("SELECT 1 FROM alive_message WHERE id = ?")
		.get(1);

	if (exists) {
		database.run("UPDATE alive_message SET message = ? WHERE id = ?", [
			message,
			1,
		]);
		return {
			changes: (
				database.query("SELECT changes() AS changes").get() as {
					changes: number;
				}
			).changes,
		};
	}

	database.run("INSERT INTO alive_message (message) VALUES (?)", [message]);
	return {
		changes: (
			database.query("SELECT changes() AS changes").get() as { changes: number }
		).changes,
	};
};

export const getAlive = () => {
	const result = database
		.query("SELECT message FROM alive_message WHERE id = ?")
		.get(1) as { message?: string } | null;
	return result?.message ?? "_I am alive_";
};

export const delAlive = () => {
	const exists = database
		.query("SELECT 1 FROM alive_message WHERE id = ?")
		.get(1);
	if (exists) {
		database.run("DELETE FROM alive_message WHERE id = ?");
		return {
			changes: (
				database.query("SELECT changes() AS changes").get() as {
					changes: number;
				}
			).changes,
		};
	}
	return;
};
