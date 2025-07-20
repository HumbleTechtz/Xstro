import { isJidUser, isLidUser } from "baileys";
import { ContactDb } from "..";
import type { Contact } from "baileys";

export default (contacts: Contact[]) => {
	for (const contact of contacts) {
		if (isJidUser(contact.id) || isLidUser(contact.id)) {
			ContactDb.save(contact);
		}
	}
};
