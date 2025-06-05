import { Database, JournalMode } from "quantava";
let database;
database = new Database("database.db", {
    journalMode: JournalMode.WAL,
});
export default database;
