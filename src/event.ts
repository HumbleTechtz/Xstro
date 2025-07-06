import { WASocket } from "baileys";
import {
	background,
	connection,
	messageUpsert,
	messageUpdate,
	messageDlt,
} from "./services";

export default async (sock: WASocket, saveCreds: { (): void }) => {
	return await Promise.all([
		background(sock),

		sock.ev.process(async ev => {
			if (ev["creds.update"]) saveCreds();

			if (ev["connection.update"]) {
				await connection(ev["connection.update"], sock);
			}

			if (ev["messages.upsert"]) {
				await messageUpsert(sock, ev["messages.upsert"]);
			}

			if (ev["messages.update"]) {
				await messageUpdate(sock, ev["messages.update"]);
			}

			if (ev["messages.delete"]) {
				await messageDlt(sock, ev["messages.delete"]);
			}
		}),
	]);
};
