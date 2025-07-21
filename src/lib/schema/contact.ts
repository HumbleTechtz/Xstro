import { sqlite } from "src";
import type { Contact } from "baileys";

sqlite.exec(`
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

export default {
	save: (contact: Contact) => {
		sqlite
			.prepare(
				`INSERT OR REPLACE INTO contacts (
          id, lid, jid, name, notify, verifiedName, imgUrl, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
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
	},

	get: (id: string) => {
		return sqlite.prepare(`SELECT * FROM contacts WHERE id = ?`).get(id);
	},

	del: (id: string) => {
		sqlite.prepare(`DELETE FROM contacts WHERE id = ?`).run(id);
	},
};
