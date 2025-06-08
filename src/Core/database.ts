import Quantava from "quantava";

const database = new Quantava({
	filename: "database.db",
	journalMode: "wal",
	walAutoCheckpoint: 10000000,
	foreignKeys: true,
	synchronous: "off",
});

export default database;
