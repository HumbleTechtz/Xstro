import { Database, JournalMode } from "quantava";

let database: Database;
database = new Database("database.db", {
	journalMode: JournalMode.WAL,
});

export default database;
