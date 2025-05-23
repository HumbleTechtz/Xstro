import { Database, JournalMode } from 'quantava';

const database = new Database('database.db', { journalMode: JournalMode.WAL });

process.on('exit', () => {
	database.close();
});

process.on('SIGINT', () => {
	database.close();
});

process.on('SIGTERM', () => {
	database.close();
});

process.on('uncaughtException', err => {
	console.log('Error:', err);
});

process.on('unhandledRejection', er => {
	console.log('Error', er);
});

export default database;
