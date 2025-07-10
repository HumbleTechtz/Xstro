import { Green, logSeralized, saveUpserts, serialize, execute } from "lib";
import type { WASocket, BaileysEventMap } from "baileys";

export async function messageUpsert(
	sock: WASocket,
	event: BaileysEventMap["messages.upsert"]
) {
	for (const message of event.messages) {
		if (!message || typeof message !== "object") continue;

		const msg = await serialize(sock, message);
		const protocol = msg?.message?.protocolMessage;

		if (protocol?.type === 0) {
			sock.ev.emit("messages.delete", {
				keys: [{ ...protocol.key }],
			});
		}

		await Promise.all([execute(msg), saveUpserts(event), logSeralized(msg)]);
	}
}

export async function messageUpdate(
	sock: WASocket,
	event: BaileysEventMap["messages.update"]
) {
	Green("Message updated:", event);
}

export async function messageDlt(
	sock: WASocket,
	event: BaileysEventMap["messages.delete"]
) {
	Green("Message deleted:", event);
}
