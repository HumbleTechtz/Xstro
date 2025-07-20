import { en } from "..";
import type { CommandModule } from "types";

export default [
	{
		pattern: "archive",
		fromMe: true,
		isGroup: false,
		desc: "Archive chat",
		type: "chats",
		handler: async msg => {
			await msg.chatModify(
				{
					archive: true,
					lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
				},
				msg.chat
			);
			return msg.send(en.plugin.chats.archive.success);
		},
	},
	{
		pattern: "unarchive",
		fromMe: true,
		isGroup: false,
		desc: "Delete a message",
		type: "chats",
		handler: async msg => {
			await msg.chatModify(
				{
					archive: false,
					lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
				},
				msg.chat
			);
			return msg.send(en.plugin.chats.unarchive.success);
		},
	},
] satisfies CommandModule[];
