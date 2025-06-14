import database from "../Core/database.ts";

database.exec(`
  CREATE TABLE IF NOT EXISTS antidelete (
    mode INTEGER
  )
`);

export const setAntidelete = async (mode: boolean): Promise<boolean> => {
	const record = database
		.query("SELECT mode FROM antidelete LIMIT 1")
		.get() as { mode: boolean | null } | null;

	if (!record) {
		database.run("INSERT INTO antidelete (mode) VALUES (?)", [mode ? 1 : 0]);
		return true;
	}

	if (record.mode === mode) return false;

	database.run("DELETE FROM antidelete");
	database.run("INSERT INTO antidelete (mode) VALUES (?)", [mode ? 1 : 0]);
	return true;
};

export const getAntidelete = async (): Promise<boolean> => {
	const record = database
		.query("SELECT mode FROM antidelete LIMIT 1")
		.get() as { mode: boolean | null } | null;
	return Boolean(record?.mode);
};
