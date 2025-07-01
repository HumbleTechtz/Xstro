import database from "../client/database";
import type { Contact } from "baileys";

database.exec(`
	CREATE TABLE IF NOT EXISTS contacts (
	id TEXT PRIMARY KEY,
	lid TEXT,
	jid TEXT,
	name TEXT,
	notify TEXT,
	verifiedName TEXT,
	imgUrl TEXT,
	status TEXT
  )
`);

export const saveContact = (contact: Contact) => {
	database
		.prepare(
			`
      INSERT OR REPLACE INTO contacts (
        id, lid, jid, name, notify, verifiedName, imgUrl, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
		)
		.run(
			contact.id,
			contact.lid ?? null,
			contact.jid ?? null,
			contact.name ?? null,
			contact.notify ?? null,
			contact.verifiedName ?? null,
			contact.imgUrl ?? null,
			contact.status ?? null
		);
};

export const getContact = (id: string) => {
	return database.prepare(`SELECT * FROM contacts WHERE id = ?`).get(id);
};

export const deleteContact = (id: string) => {
	database.prepare(`DELETE FROM contacts WHERE id = ?`).run(id);
};
