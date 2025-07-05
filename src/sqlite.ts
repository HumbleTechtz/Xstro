import { Database } from "bun:sqlite";

const sqlite = new Database("database.db", { create: true, readwrite: true });

sqlite.exec("PRAGMA journal_mode = WAL");
sqlite.exec("PRAGMA wal_autocheckpoint = 4096");
sqlite.exec("PRAGMA foreign_keys = ON");
sqlite.exec("PRAGMA synchronous = OFF");

export default sqlite;
