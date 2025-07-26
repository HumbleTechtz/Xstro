import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./database.db",
	logging: false,

	dialectOptions: {
		mode:
			(await import("sqlite3")).OPEN_READWRITE |
			(await import("sqlite3")).OPEN_CREATE,
	},

	pool: {
		max: 5,
		min: 1,
		acquire: 30000,
		idle: 10000,
	},

	define: {
		freezeTableName: true,
		timestamps: true,
	},
});

await sequelize.authenticate({});

await sequelize.query("PRAGMA journal_mode = WAL;");
await sequelize.query("PRAGMA synchronous = NORMAL;");
await sequelize.query("PRAGMA cache_size = -10000;");
await sequelize.query("PRAGMA temp_store = MEMORY;");
await sequelize.query("PRAGMA foreign_keys = ON;");

export default sequelize;
