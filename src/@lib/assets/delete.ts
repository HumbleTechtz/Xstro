import type { CommandModule } from "src/Types";

export default [
	{
		pattern: "delete",
		fromMe: true,
		isGroup: false,
		desc: "Delete chat",
		type: "chats",
		handler: async msg => {
			return await msg.chatModify(
				{
					delete: true,
					lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
				},
				msg.chat
			);
		},
	},
	{
		pattern: "dlt",
		aliases: ["del"],
		fromMe: true,
		isGroup: false,
		desc: "Delete a message",
		type: "chats",
		handler: async msg => {
			return await msg.delete();
		},
	},
] satisfies CommandModule[];
