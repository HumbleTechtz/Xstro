import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default [
	{
		pattern: "star",
		fromMe: true,
		isGroup: false,
		desc: "Star a message",
		type: "chats",
		handler: async msg => {
			if (!msg.quoted) return msg.send(en.reply_msg);
			await msg.chatModify(
				{
					star: {
						messages: [msg.quoted.key],
						star: true,
					},
				},
				msg.chat
			);
			return msg.send(en.plugin.chats.star.success);
		},
	},
	{
		pattern: "unstar",
		fromMe: true,
		isGroup: false,
		desc: "Unstar a message",
		type: "chats",
		handler: async msg => {
			if (!msg.quoted) return msg.send(en.reply_msg);
			await msg.chatModify(
				{
					star: {
						messages: [msg.quoted.key],
						star: false,
					},
				},
				msg.chat
			);
			return msg.send(en.plugin.chats.unstar.success);
		},
	},
] satisfies CommandModule[];
