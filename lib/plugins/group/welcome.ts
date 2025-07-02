import { setWelcome, getWelcome, delWelcome } from "../../schemas";
import type { CommandModule } from "../../client";

export default {
	pattern: "welcome",
	fromMe: true,
	isGroup: true,
	desc: "Set, get, or remove welcome message",
	type: "group",
	run: async (msg, args) => {
		const groupJid = msg.chat;

		if (!args) {
			const current = getWelcome(groupJid);
			const state = current ? "ON" : "OFF";
			const text = current || "_No welcome message set._";
			return msg.send(`_Welcome is ${state.toLowerCase()}_\n\n${text}`);
		}

		if (args.toLowerCase().trim() === "off") {
			delWelcome(groupJid);
			return msg.send("_Welcome message removed._");
		}

		if (args.toLowerCase().trim() === "on") {
			return msg.send("```Provide the welcome message after on.```");
		}

		setWelcome(groupJid, args);
		return msg.send("_Welcome message set._");
	},
} satisfies CommandModule;
