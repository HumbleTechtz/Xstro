import { sqlite } from "src";

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS prefix (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    value TEXT
  );
`);

export function setprefix(value: string | null): void {
	sqlite
		.prepare(`INSERT OR REPLACE INTO prefix (id, value) VALUES (1, ?);`)
		.run(value);
}

export function getprefix(): string | null {
	const row = sqlite.prepare(`SELECT value FROM prefix WHERE id = 1;`).get() as
		| { value: string | null }
		| undefined;

	return row?.value ?? null;
}
