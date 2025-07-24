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
		PRAGMA journal_mode = WAL;
		PRAGMA synchronous = NORMAL;
		PRAGMA temp_store = MEMORY;
		PRAGMA cache_size = -64000;
		PRAGMA foreign_keys = ON;
		PRAGMA automatic_index = ON;
		PRAGMA optimize;
	`);
});
