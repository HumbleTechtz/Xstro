import { logSeralized, saveUpserts, serialize, type Serialize } from "lib";
import type { BaileysEventMap, WASocket } from "baileys";

export async function messageUpsert(
	sock: WASocket,
	event: BaileysEventMap["messages.upsert"]
) {
	const parsed = await serialize(sock, event.messages[0]);
	const protocol = parsed ? parsed.message?.protocolMessage : undefined;

	if (protocol?.type === 0)
		sock.ev.emit("messages.delete", {
			keys: [{ ...protocol.key }],
		});

	await Promise.all([saveUpserts(event), logSeralized(parsed!)]);
}

export async function messageUpdate(
	sock: WASocket,
	event: BaileysEventMap["messages.update"]
) {
	console.log("Message updated:", event);
}

export async function messageDlt(
	sock: WASocket,
	event: BaileysEventMap["messages.delete"]
) {
	console.log("Message deleted:", event);
}
