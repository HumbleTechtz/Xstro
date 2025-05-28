import { Database, JournalMode } from "quantava";

let database: Database;
export default database = new Database("database.db", {
	journalMode: JournalMode.WAL,
});
