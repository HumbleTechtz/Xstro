import Quantava from "quantava";

const database = new Quantava({ filename: "database.db", journalMode: "wal" });

export default database;
