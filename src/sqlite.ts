import { Database } from "bun:sqlite";

const sqlite = new Database("database.db", { create: true, readwrite: true });

sqlite.exec(`
	PRAGMA journal_mode = WAL;
	PRAGMA wal_autocheckpoint = 4096;
	PRAGMA foreign_keys = ON;
	PRAGMA synchronous = OFF;
`);

export { sqlite };
