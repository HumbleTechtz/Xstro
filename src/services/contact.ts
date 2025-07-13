import { isJidUser, isLidUser, type Contact } from "baileys";
import { ContactDb } from "lib";

export default (contacts: Contact[]) => {
	for (const contact of contacts) {
		if (isJidUser(contact.id) || isLidUser(contact.id)) {
			ContactDb.save(contact);
		}
	}
};
