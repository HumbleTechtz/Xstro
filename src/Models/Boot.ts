import database from "../Core/database.ts";

database.exec(`
  CREATE TABLE IF NOT EXISTS boot_status (
    id INTEGER PRIMARY KEY
  )
`);

export const getBoot = async (): Promise<boolean> => {
	const boot = database
		.query("SELECT id FROM boot_status WHERE id = ?")
		.get(1) as {
		id: number | null;
	} | null;
	return Boolean(boot?.id);
};

export const setBoot = async (id: boolean): Promise<void> => {
	const exists = database
		.query("SELECT 1 FROM boot_status WHERE id = ?")
		.get(1);
	if (exists) {
		database.run("UPDATE boot_status SET id = ? WHERE id = ?", [id ? 1 : 0, 1]);
	} else {
		database.run("INSERT INTO boot_status (id) VALUES (?)", [id ? 1 : 0]);
	}
};
