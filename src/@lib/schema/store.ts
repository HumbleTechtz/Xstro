import { sqlite } from "src";
import { WAProto, type BaileysEventMap, type WAMessageKey } from "baileys";

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    messages TEXT,
    requestId TEXT
  )
`);

export default {
	save: (event: BaileysEventMap["messages.upsert"]) => {
		if (!event?.messages?.[0]?.key?.id) return;
		const id = event.messages[0].key.id;
		const requestId = event.requestId ?? null;

		try {
			sqlite.run(
				"INSERT INTO messages (id, messages, requestId) VALUES (?, ?, ?)",
				[id, JSON.stringify(event.messages[0]), requestId]
			);
		} catch {}
	},

	load: (key: WAMessageKey) => {
		const exists = sqlite
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
	},
	get: async (key: WAMessageKey): Promise<WAProto.IMessage | undefined> => {
		if (!key) return undefined;
		return WAProto.Message.fromObject({});
	},
};
