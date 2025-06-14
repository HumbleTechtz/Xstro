import { Database } from "bun:sqlite";

const database = new Database("database.db", { create: true, readwrite: true });

database.exec("PRAGMA journal_mode = WAL");
database.exec("PRAGMA wal_autocheckpoint = 4096");
database.exec("PRAGMA foreign_keys = ON");
database.exec("PRAGMA synchronous = OFF");

export default database;
