import { isJidUser, isLidUser, type Contact } from "baileys";
import { saveContact } from "lib";

export default (contacts: Contact[]) => {
	for (const contact of contacts) {
		if (isJidUser(contact.id) || isLidUser(contact.id)) {
			saveContact(contact);
		}
	}
};
