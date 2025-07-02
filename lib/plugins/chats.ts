import type { CommandModule } from "../client";

export default [
	{
		pattern: "cpin",
		fromMe: true,
		isGroup: false,
		desc: "Pin a chat",
		type: "chats",
		run: async msg => {
			await msg.chatModify({ pin: true }, msg.chat);
			return msg.send("Pined.");
		},
	},
	{
		pattern: "cunpin",
		fromMe: true,
		isGroup: false,
		desc: "Unpin a chat",
		type: "chats",
		run: async msg => {
			await msg.chatModify({ pin: false }, msg.chat);
			return msg.send("Unpined.");
		},
	},
	{
		pattern: "archive",
		fromMe: true,
		isGroup: false,
		desc: "Archive a chat",
		type: "chats",
		run: async msg => {
			await msg.chatModify(
				{
					archive: true,
					lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
				},
				msg.chat
			);
			return msg.send("Archived.");
		},
	},
	{
		pattern: "unarchive",
		fromMe: true,
		isGroup: false,
		desc: "Unarchive a chat",
		type: "chats",
		run: async msg => {
			await msg.chatModify(
				{
					archive: false,
					lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
				},
				msg.chat
			);
			return msg.send("Unarchived.");
		},
	},
	{
		pattern: "clear",
		fromMe: true,
		isGroup: false,
		desc: "Clear a chat",
		type: "chats",
		run: async msg => {
			await msg.chatModify(
				{
					delete: true,
					lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
				},
				msg.chat
			);
			return msg.send("Cleared.");
		},
	},
	{
		pattern: "delete",
		fromMe: true,
		isGroup: false,
		desc: "Delete a chat",
		type: "chats",
		run: async msg => {
			return msg.chatModify(
				{
					delete: true,
					lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }],
				},
				msg.chat
			);
		},
	},
	{
		pattern: "star",
		fromMe: true,
		isGroup: false,
		desc: "Star a message",
		type: "chats",
		run: async msg => {
			if (!msg.quoted) return msg.send("Reply a message");

			const { id, fromMe } = msg.quoted.key as { id: string; fromMe: boolean };

			await msg.chatModify(
				{
					star: {
						messages: [{ id, fromMe }],
						star: true,
					},
				},
				msg.chat
			);
			return msg.send("Starred.");
		},
	},
	{
		pattern: "unstar",
		fromMe: true,
		isGroup: false,
		desc: "Unstar a message",
		type: "chats",
		run: async msg => {
			if (!msg.quoted) return msg.send("Reply a message to unstar");

			const { id, fromMe } = msg.quoted.key as { id: string; fromMe: boolean };

			await msg.chatModify(
				{
					star: {
						messages: [{ id, fromMe }],
						star: false,
					},
				},
				msg.chat
			);
			return msg.send("Unstarred.");
		},
	},
	{
		pattern: "pin",
		fromMe: false,
		isGroup: false,
		desc: "Pin a message",
		type: "chats",
		run: async msg => {
			if (!msg.quoted) return msg.send("Reply a message");

			return msg.sendMessage(msg.chat, {
				pin: msg.quoted.key,
				type: 1,
				time: 604800,
			});
		},
	},
	{
		pattern: "unpin",
		fromMe: false,
		isGroup: false,
		desc: "Unpin a message",
		type: "chats",
		run: async msg => {
			if (!msg.quoted) return msg.send("Reply a message");

			return msg.sendMessage(msg.chat, {
				pin: msg.quoted.key,
				type: 2,
				time: undefined,
			});
		},
	},
] satisfies CommandModule[];
