import { delay } from "baileys";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default [
	{
		pattern: "block",
		fromMe: true,
		isGroup: false,
		desc: "Block a user from Messaging you",
		type: "whatsapp",
		handler: async (msg, args) => {
			const jid = await msg.user(args);
			if (!jid) return msg.send(en.warn.invaild_user);
			await msg.send(en.plugin.block.blocked);
			await delay(300);
			return await msg.updateBlockStatus(jid.id, "block");
		},
	},
	{
		pattern: "unblock",
		fromMe: true,
		isGroup: false,
		desc: "Unblock a user to allow Messaging",
		type: "whatsapp",
		handler: async (msg, args) => {
			const jid = await msg.user(args);
			if (!jid) return msg.send(en.warn.invaild_user);
			await msg.updateBlockStatus(jid.id, "unblock");
			return await msg.send(en.plugin.block.unblocked);
		},
	},
] satisfies CommandModule[];
