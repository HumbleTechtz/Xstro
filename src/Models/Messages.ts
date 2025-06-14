import database from "../Core/database.ts";
import { WAProto, type BaileysEventMap, type WAMessageKey } from "baileys";

database.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    messages TEXT,
    requestId TEXT
  )
`);

export async function save_message(
	event: BaileysEventMap["messages.upsert"]
): Promise<void> {
	if (!event?.messages?.[0]?.key?.id) return;
	const id = event.messages[0].key.id;
	const requestId = event.requestId ?? null;

	try {
		database.run(
			"INSERT INTO messages (id, messages, requestId) VALUES (?, ?, ?)",
			[id, JSON.stringify(event.messages[0]), requestId]
		);
	} catch {}
}

export async function getMessage(
	key: WAMessageKey
): Promise<WAProto.WebMessageInfo["message"] | undefined> {
	const exists = database
		.query("SELECT messages FROM messages WHERE id = ?")
		.get(key.id!) as {
		id: string;
		messages: string | null;
		requestId: string | null;
	} | null;
	if (exists?.messages) {
		return (
			WAProto.WebMessageInfo.fromObject(JSON.parse(exists.messages)).message ||
			undefined
		);
	}
}

export async function loadMessage(
	key: WAMessageKey
): Promise<WAProto.WebMessageInfo | undefined> {
	const exists = database
		.query("SELECT messages FROM messages WHERE id = ?")
		.get(key.id!) as {
		id: string;
		messages: string | null;
		requestId: string | null;
	} | null;
	if (exists?.messages) {
		return (
			WAProto.WebMessageInfo.fromObject(JSON.parse(exists.messages)) ||
			undefined
		);
	}
}
