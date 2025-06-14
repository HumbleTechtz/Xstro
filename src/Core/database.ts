import Quantava from "quantava";

export default new Quantava({
	filename: "database.db",
	journalMode: "wal",
	walAutoCheckpoint: 10000000,
	foreignKeys: true,
	synchronous: "off",
});
