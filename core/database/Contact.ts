import database from "../Core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS contacts (
	name TEXT,
	bizname TEXT,
	jid TEXT,
	lid TEXT,
	bio TEXT
	)
`);
