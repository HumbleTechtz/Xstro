import { Sequelize } from "sequelize";

export const database = new Sequelize({
	dialect: "sqlite",
	storage: "./database.db",
	logging: false,
	dialectOptions: {
		mode: 2,
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 10000,
		idle: 10000,
	},
});

database.Sequelize.afterConnect(async (connection: any) => {
	await connection.exec(`
		PRAGMA journal_mode = WAL;             -- Better concurrent read/write
		PRAGMA synchronous = NORMAL;           -- Balance between speed and safety
		PRAGMA temp_store = MEMORY;            -- Use memory for temp tables
		PRAGMA cache_size = -64000;            -- Approx. 64MB in-memory cache
		PRAGMA foreign_keys = ON;              -- Enforce foreign key constraints
		PRAGMA automatic_index = ON;           -- Let SQLite auto-create indexes
		PRAGMA optimize;                       -- Run query planner analysis
	`);
});
