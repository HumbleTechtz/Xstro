import database from "../core/database";
import { WAProto, type BaileysEventMap, type WAMessageKey } from "baileys";

database.exec(`
	CREATE TABLE IF NOT EXISTS messages (
	id TEXT PRIMARY KEY,
	messages TEXT,
	requestId TEXT
	)
`);

export function saveMessage(event: BaileysEventMap["messages.upsert"]) {
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

export function getMessage(key: WAMessageKey) {
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

export function loadMessage(key: WAMessageKey) {
	const exists = database
		.query("SELECT messages FROM messages WHERE id = ?")
		.get(key.id!) as {
		id: string;
		messages: string | null;
		requestId: string | null;
	} | null;
	if (exists?.messages) {
		return (
			WAProto.WebMessageInfo.fromObject(JSON.parse(exists.messages)) || undefined
		);
	}
}
