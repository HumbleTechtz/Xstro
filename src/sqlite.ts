import { Database } from "bun:sqlite";
import { en } from "lib/resources";
import { Green } from "lib/utils/console";

const sqlite = new Database("database.db", { create: true, readwrite: true });

sqlite.exec(`
	PRAGMA journal_mode = WAL;
	PRAGMA wal_autocheckpoint = 4096;
	PRAGMA foreign_keys = ON;
	PRAGMA synchronous = OFF;
`);
Green(en.db_initialized);

export { sqlite };
