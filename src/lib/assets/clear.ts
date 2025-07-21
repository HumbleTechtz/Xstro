import { en } from "..";
import type { CommandModule } from "src/Types";

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
