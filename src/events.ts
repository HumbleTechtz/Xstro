import handleConnectionUpdate from "./services/connect.ts";
import type { WASocket, BaileysEventMap } from "baileys";

export default function registerSocketEvents(sock: WASocket) {
	sock.ev.process(async (events: Partial<BaileysEventMap>) => {
		if (events["connection.update"]) {
			await handleConnectionUpdate(sock, events["connection.update"]);
		}

		if (events["messages.upsert"]) {
			const update = events["messages.upsert"].messages[0];
			console.log(JSON.stringify(update, null, 2));
		}
	});
}
