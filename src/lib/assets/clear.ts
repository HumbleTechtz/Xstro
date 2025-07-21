import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "clear",
	fromMe: true,
	isGroup: false,
	desc: "Clear chat",
	type: "chats",
	handler: async msg => {
		await msg.chatModify(
			{
				clear: true,
				lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
			},
			msg.chat
		);
		return msg.send(en.plugin.chats.clear.success);
	},
} satisfies CommandModule;
