import { Database } from '@astrox11/sqlite';

const database = new Database('database.db');

process.on('exit', () => {
	database.close();
});

process.on('SIGINT', async () => {
	database.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	database.close();
	process.exit(0);
});

process.on('uncaughtException', async () => {
	database.close();
	process.exit(1);
});

process.on('unhandledRejection', async () => {
	database.close();
	process.exit(1);
});

export default database;
