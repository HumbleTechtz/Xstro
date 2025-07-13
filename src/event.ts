import { Contact, WASocket } from "baileys";
import {
	hooks,
	connection,
	messagesUpsert,
	messagesDelete,
	contact,
} from "./services";

export default async (sock: WASocket, saveCreds: { (): void }) => {
	return await Promise.allSettled([
		sock.ev.process(async ev => {
			if (ev["creds.update"]) saveCreds();

			if (ev["connection.update"]) {
				await connection(ev["connection.update"], sock);
			}

			if (ev["messages.upsert"]) {
				await messagesUpsert(sock, ev["messages.upsert"]);
			}

			if (ev["messages.delete"]) {
				await messagesDelete(sock, ev["messages.delete"]);
			}
			if (ev["messaging-history.set"]) {
				const { contacts } = ev["messaging-history.set"];
				Promise.allSettled([contact(contacts)]);
			}
			if (ev["contacts.update"]) {
				contact(ev["contacts.update"] as Contact[]);
			}
			if (ev["contacts.upsert"]) {
				contact(ev["contacts.upsert"]);
			}
		}),
		hooks(sock),
	]);
};
