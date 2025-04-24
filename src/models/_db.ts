import Database from '@astrox11/sqlite';
import config from '../../config.ts';

const database = new Database(config.DATABASE);

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
