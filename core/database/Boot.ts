import database from "../core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS boot_status (
	status INTEGER NOT NULL
	)
`);

export const getBoot = () => {
	const boot = database
		.query("SELECT status FROM boot_status LIMIT 1")
		.get() as { status: number } | null;
	return Boolean(boot?.status);
};

export const setBoot = (status: boolean) => {
	const exists = database.query("SELECT 1 FROM boot_status LIMIT 1").get();
	if (exists) {
		database.run("UPDATE boot_status SET status = ?", [status ? 1 : 0]);
	} else {
		database.run("INSERT INTO boot_status (status) VALUES (?)", [status ? 1 : 0]);
	}
};
