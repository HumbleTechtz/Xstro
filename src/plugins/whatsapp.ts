import { delay } from "baileys";
import { Command } from "../messaging/plugin.ts";

Command({
	name: "bio",
	fromMe: true,
	isGroup: false,
	desc: "Change your WA Bio",
	type: "whatsapp",
	function: async (message, match) => {
		if (!match) return message.send("No bio text provided");
		await message.updateProfileStatus(match);
		return message.send("```Bio Updated```");
	},
});

Command({
	name: "waname",
	fromMe: true,
	isGroup: false,
	desc: "Change your WA Profile Name",
	type: "whatsapp",
	function: async (message, match) => {
		if (!match) return message.send("No name provided");
		await message.updateProfileName(match);
		return message.send("```Name Updated```");
	},
});

Command({
	name: "block",
	fromMe: true,
	isGroup: false,
	desc: "Block a user from Messaging you",
	type: "whatsapp",
	function: async (message, match) => {
		const jid = await message.parseId(match);
		if (!jid) return message.send("```No user specified to block```");
		await message.send("```Blocked```");
		await delay(300);
		return message.updateBlockStatus(jid, "block");
	},
});

Command({
	name: "unblock",
	fromMe: true,
	isGroup: false,
	desc: "Unblock a user to allow Messaging",
	type: "whatsapp",
	function: async (message, match) => {
		const jid = await message.parseId(match);
		if (!jid) return message.send("```No user specified to unblock```");
		await message.updateBlockStatus(jid, "unblock");
		return await message.send("```Unblocked```");
	},
});

Command({
	name: "pp",
	fromMe: true,
	isGroup: false,
	desc: "Update Your Profile Image",
	type: "whatsapp",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !(msg.type === "imageMessage"))
			return message.send("```Reply an Image```");
		const media = await message.downloadM();
		await message.updateProfilePicture(message.owner.jid, media);
		return message.send("```Profile Photo Updated```");
	},
});

Command({
	name: "vv",
	fromMe: true,
	isGroup: false,
	desc: "Converts view-once to message",
	type: "whatsapp",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.viewOnce) return message.send("```Reply a Viewonce```");
		if (msg.message) {
			const mediaType = msg.type as
				| "imageMessage"
				| "videoMessage"
				| "audioMessage";
			msg.message[mediaType]!.viewOnce = false;
			return await message.forward(message.jid, msg, { quoted: message });
		}
	},
});

Command({
	name: "tovv",
	fromMe: true,
	isGroup: false,
	desc: "Converts message to view-once",
	type: "whatsapp",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.media) return message.send("```Reply a media message```");
		const msgs = msg.type as "imageMessage" | "videoMessage" | "audioMessage";
		if (msg.message?.[msgs]) {
			msg.message[msgs].viewOnce = true;
			return await message.forward(message.jid, msg, { quoted: message });
		}
	},
});

Command({
	name: "edit",
	fromMe: true,
	isGroup: false,
	desc: "Edit your own message",
	type: "whatsapp",
	function: async (message, match) => {
		const msg = message.quoted;
		if (!msg || !msg?.key.fromMe)
			return message.send("```Reply your own message```");
		if (!match) return message.send(`Usage: $${message.prefix[0]}edit Hello.`);
		return await message.editM(match);
	},
});

Command({
	name: "dlt",
	fromMe: false,
	isGroup: false,
	desc: "Delete a message for us and others if bot is admin",
	type: "whatsapp",
	function: async message => {
		const msg = message.quoted;
		if (!msg) return message.send("```Reply a message```");
		return await message.deleteM(msg.key);
	},
});

Command({
	name: "blocklist",
	fromMe: true,
	isGroup: false,
	desc: "Get all the list of numbers you have blocked",
	type: "whatsapp",
	function: async message => {
		const users = await message.fetchBlocklist();
		if (!users) return message.send("No blocked users found");
		return await message.send(
			users.map((nums: string) => `\n@${nums.split("@")[0]}`).join(""),
			{
				mentions: users,
			},
		);
	},
});

Command({
	name: "save",
	fromMe: true,
	isGroup: false,
	desc: "Save a status by replying to it",
	type: "whatsapp",
	function: async message => {
		const msg = message.quoted;
		if (!msg?.broadcast) return message.send("No status replied to");
		await message.forward(message.owner.jid, msg, { quoted: msg });
		return message.send("Status saved!");
	},
});

Command({
	name: "forward",
	fromMe: true,
	isGroup: false,
	desc: "Forward a message to a user",
	type: "whatsapp",
	function: async (message, match) => {
		const msg = message.quoted;
		if (!msg) return message.send("No message quoted to forward");
		const jid = await message.parseId(match);
		if (!jid) return message.send("No user specified to forward");
		if (!(await message.onWhatsApp(jid)))
			return message.send("User is not on WhatsApp");
		await message.forward(jid, msg, {
			isForwarded: true,
			forwardingScore: 999,
			quoted: message,
		});
		return message.send("Message forwarded successfully");
	},
});
