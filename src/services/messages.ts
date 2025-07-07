import { Green, logSeralized, saveUpserts, serialize, execute } from "lib";
import type { WASocket, BaileysEventMap } from "baileys";

export async function messageUpsert(
	sock: WASocket,
	event: BaileysEventMap["messages.upsert"]
) {
	const msg = await serialize(sock, event.messages[0]);
	const protocol = msg ? msg.message?.protocolMessage : undefined;

	if (protocol?.type === 0)
		sock.ev.emit("messages.delete", {
			keys: [{ ...protocol.key }],
		});

	await Promise.all([execute(msg), saveUpserts(event), logSeralized(msg)]);
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
