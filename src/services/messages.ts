import type { BaileysEventMap } from "baileys";

export async function messages(events: {
	upserts?: BaileysEventMap["messages.upsert"];
	updates?: BaileysEventMap["messages.update"];
	reactions?: BaileysEventMap["messages.reaction"];
	deletes?: BaileysEventMap["messages.delete"];
}) {
	const { upserts, updates, reactions, deletes } = events;
}
