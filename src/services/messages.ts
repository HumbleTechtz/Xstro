import {
	Green,
	saveUpserts,
	serialize,
	execute,
	Serialize,
	getprefix,
	isSudo,
} from "lib";
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

		await Promise.allSettled([_callCommands(msg), saveUpserts(event)]);
	}
}

export async function messageDlt(
	sock: WASocket,
	event: BaileysEventMap["messages.delete"]
) {
	Green("Message deleted:", event);
}

function _callCommands(msg: Serialize) {
	const prefix = getprefix();
	if (!!prefix && /\S/.test(prefix)) {
		if (!msg.text.startsWith(prefix)) return;
	}

	console.log(msg.text);

	return execute(msg);
}
