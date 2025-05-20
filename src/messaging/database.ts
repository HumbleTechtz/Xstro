import { Database, JournalMode } from 'quantava';

const database = new Database('database.db', { journalMode: JournalMode.WAL });

process.on('exit', () => {
	database.close();
});

process.on('SIGINT', () => {
	database.close();
});

process.on('SIGTERM', () => {
	console.log('SIGTERM received');
});

process.on('uncaughtException', err => {
	console.log('Database Error:', err);
});

process.on('unhandledRejection', er => {
	console.log('Database Error', er);
});

export default database;
