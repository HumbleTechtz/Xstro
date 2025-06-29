import { delay } from "baileys";
import type { CommandModule } from "../client/Core";

export default [
	{
		pattern: "bio",
		fromMe: true,
		isGroup: false,
		desc: "Change your WA Bio",
		type: "whatsapp",
		run: async (message, match) => {
			if (!match) return message.send("No bio text provided");
			await message.updateProfileStatus(match);
			return message.send("```Bio Updated```");
		},
	},
	{
		pattern: "waname",
		fromMe: true,
		isGroup: false,
		desc: "Change your WA Profile Name",
		type: "whatsapp",
		run: async (message, match) => {
			if (!match) return message.send("No name provided");
			await message.updateProfileName(match);
			return message.send("```Name Updated```");
		},
	},
	{
		pattern: "block",
		fromMe: true,
		isGroup: false,
		desc: "Block a user from Messaging you",
		type: "whatsapp",
		run: async (message, match) => {
			const jid = await message.userId(match);
			if (!jid) return message.send("```No user specified to block```");
			await message.send("```Blocked```");
			await delay(300);
			return message.updateBlockStatus(jid, "block");
		},
	},
	{
		pattern: "unblock",
		fromMe: true,
		isGroup: false,
		desc: "Unblock a user to allow Messaging",
		type: "whatsapp",
		run: async (message, match) => {
			const jid = await message.userId(match);
			if (!jid) return message.send("```No user specified to unblock```");
			await message.updateBlockStatus(jid, "unblock");
			return await message.send("```Unblocked```");
		},
	},
	{
		pattern: "pp",
		fromMe: true,
		isGroup: false,
		desc: "Update Your Profile Image",
		type: "whatsapp",
		run: async message => {
			const msg = message.quoted;
			if (!msg || !msg.image) return message.send("```Reply an Image```");
			const media = await message.download();
			await message.updateProfilePicture(message.owner.jid, media as Buffer);
			return message.send("```Profile Photo Updated```");
		},
	},
	{
		pattern: "vv",
		fromMe: true,
		isGroup: false,
		desc: "Converts view-once to message",
		type: "whatsapp",
		run: async message => {
			const msg = message.quoted;
			if (!msg?.viewonce)
				return message.send("Use, your phone to reply a viewonce");
			if (msg.message && msg.msg_type && msg.message[msg.msg_type]) {
				//@ts-ignore
				msg.message[msg.msg_type].viewOnce = false;
			}
			return await message.forward(message.chat, msg, { quoted: message });
		},
	},
	{
		pattern: "tovv",
		fromMe: true,
		isGroup: false,
		desc: "Converts message to view-once",
		type: "whatsapp",
		run: async message => {
			const msg = message.quoted;
			if (!msg || (!msg.audio && !msg.video && !msg.image))
				return message.send("```Reply a media message```");
			if (msg.message && msg.msg_type && msg.message[msg.msg_type]) {
				// @ts-ignore
				msg.message[msg.msg_type].viewOnce = true;
			}
			return await message.forward(message.chat, msg, { quoted: message });
		},
	},
	{
		pattern: "edit",
		fromMe: true,
		isGroup: false,
		desc: "Edit your own message",
		type: "whatsapp",
		run: async (message, match) => {
			const msg = message.quoted;
			if (!msg || !msg?.key.fromMe)
				return message.send("```Reply your own message```");
			if (!match) return message.send(`Usage: $${message.prefix[0]}edit Hello.`);
			return await message.edit(match);
		},
	},
	{
		pattern: "dlt",
		aliases: ["del"],
		fromMe: false,
		isGroup: false,
		desc: "Delete a message for us and others if bot is admin",
		type: "whatsapp",
		run: async message => {
			const msg = message.quoted;
			if (!msg) return message.send("Reply a message");
			return await message.delete();
		},
	},
	{
		pattern: "blocklist",
		fromMe: true,
		isGroup: false,
		desc: "Get all the list of numbers you have blocked",
		type: "whatsapp",
		run: async message => {
			const users = await message.fetchBlocklist();
			if (!users) return message.send("No blocked users found");
			return await message.send(
				users.map((nums: string) => `\n@${nums.split("@")[0]}`).join(""),
				{ mentions: users }
			);
		},
	},
	{
		pattern: "save",
		fromMe: true,
		isGroup: false,
		desc: "Save a status by replying to it",
		type: "whatsapp",
		run: async message => {
			const msg = message.quoted;
			if (!msg) return message.send("Reply a message");
			await message.forward(message.owner.jid, msg, { quoted: msg });
			return message.send("Message saved!");
		},
	},
	{
		pattern: "forward",
		fromMe: true,
		isGroup: false,
		desc: "Forward a message to a user",
		type: "whatsapp",
		run: async (message, match) => {
			const msg = message.quoted;
			if (!msg) return message.send("No message quoted to forward");
			const jid = await message.userId(match);
			if (!jid) return message.send("No user specified to forward");
			await message.forward(jid, msg, {
				isForwarded: true,
				forwardingScore: 999,
				quoted: message,
			});
			return message.send("Message Forwarded");
		},
	},
] satisfies CommandModule[];
