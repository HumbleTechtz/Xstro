import { sqlite } from "src";

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS antidelete (
    mode INTEGER
  )
`);

export default {
	set: (mode: boolean) => {
		const record = sqlite.query("SELECT mode FROM antidelete LIMIT 1").get() as {
			mode: boolean | null;
		} | null;

		if (!record) {
			sqlite.run("INSERT INTO antidelete (mode) VALUES (?)", [mode ? 1 : 0]);
			return true;
		}

		if (record.mode === mode) return false;

		sqlite.run("DELETE FROM antidelete");
		sqlite.run("INSERT INTO antidelete (mode) VALUES (?)", [mode ? 1 : 0]);
		return true;
	},

	get: () => {
		const record = sqlite.query("SELECT mode FROM antidelete LIMIT 1").get() as {
			mode: boolean | null;
		} | null;
		return Boolean(record?.mode);
	},
};
