import database from "../client/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS contacts (
	name TEXT,
	bizname TEXT,
	jid TEXT,
	lid TEXT,
	bio TEXT
	)
`);
