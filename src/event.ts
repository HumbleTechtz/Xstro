import { Contact, WASocket } from "baileys";
import {
	hooks,
	connection,
	messagesUpsert,
	messagesDelete,
	contact,
	participants,
	groupRequests,
} from "./services";

export default async (sock: WASocket) => {
	return await Promise.allSettled([
		sock.ev.process(async event => {
			if (event["connection.update"]) {
				await connection(event["connection.update"]);
			}

			if (event["messages.upsert"]) {
				await messagesUpsert(sock, event["messages.upsert"]);
			}

			if (event["messages.delete"]) {
				await messagesDelete(sock, event["messages.delete"]);
			}
			if (event["messaging-history.set"]) {
				const { contacts } = event["messaging-history.set"];
				contact(contacts);
			}
			if (event["contacts.update"]) {
				contact(event["contacts.update"] as Contact[]);
			}
			if (event["contacts.upsert"]) {
				contact(event["contacts.upsert"]);
			}
			if (event["group-participants.update"]) {
				await participants(sock, event["group-participants.update"]);
			}
			if (event["group.join-request"]) {
				await groupRequests(sock, event["group.join-request"]);
			}
		}),
		hooks(sock),
	]);
};
