import { setGoodBye, getGoodBye, delGoodBye } from "../../client/Models";
import type { CommandModule } from "../../client/Core";

export default {
	pattern: "goodbye",
	fromMe: true,
	isGroup: true,
	desc: "Set, get, or remove goodbye message",
	type: "group",
	run: async (msg, args) => {
		const groupJid = msg.chat;

		if (!args) {
			const current = getGoodBye(groupJid);
			const state = current ? "ON" : "OFF";
			const text = current || "_No goodbye message set._";
			return msg.send(`_Goodbye is ${state}_\n\n${text}`);
		}

		if (args.toLowerCase().trim() === "off") {
			delGoodBye(groupJid);
			return msg.send("_Goodbye message removed._");
		}

		if (args.toLowerCase().trim() === "on") {
			return msg.send("```Provide the goodbye message after setting on.```");
		}

		setGoodBye(groupJid, args);
		return msg.send("_Goodbye message set._");
	},
} satisfies CommandModule;
