import { WASocket } from "baileys";
import { background, connection, messages } from "./services";

export default async (sock: WASocket, saveCreds: { (): void }) => {
	return await Promise.all([
		background(sock),
		sock.ev.process(async listener => {
			const {
				"creds.update": credsUpdate,
				"connection.update": connectionUpdate,
				"messages.upsert": upserts,
				"messages.update": updates,
				"messages.reaction": reactions,
				"messages.delete": deletes,
			} = listener;

			if (credsUpdate) saveCreds();
			if (connectionUpdate) await connection(connectionUpdate, sock);
			if (upserts || updates || reactions || deletes) {
				await messages({ upserts, updates, reactions, deletes });
			}
		}),
	]);
};
