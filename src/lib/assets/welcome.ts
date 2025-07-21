import { Greetings } from "../schema/index.ts";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "welcome",
	fromMe: true,
	isGroup: true,
	desc: "Set, get, or remove welcome message",
	type: "group",
	handler: async (msg, args) => {
		const groupJid = msg.chat;

		if (!args?.trim()) {
			const current = await Greetings.welcome.get(groupJid);
			const state = current ? "on" : "off";
			const text = current || en.plugin.welcome.none;
			return msg.send(`_Welcome is ${state}_\n\n${text}`);
		}

		const input = args.trim().toLowerCase();

		if (input === "off") {
			await Greetings.welcome.del(groupJid);
			return msg.send(en.plugin.welcome.removed);
		}

		if (input === "on") {
			return msg.send(en.plugin.welcome.no_content);
		}

		await Greetings.welcome.set(groupJid, args);
		return msg.send(en.plugin.welcome.set);
	},
} satisfies CommandModule;
