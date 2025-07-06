import { WASocket } from "baileys";
import { background, connection } from "./services";

export default async (sock: WASocket, saveCreds: { (): void }) => {
	return await Promise.all([
		background(sock),
		sock.ev.process(async listener => {
			if (listener["creds.update"]) saveCreds();
			if (listener["connection.update"]) {
				await connection(listener["connection.update"], sock);
			}
		}),
	]);
};
