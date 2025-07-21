import { Greetings } from "../schema/index.ts";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "goodbye",
	fromMe: true,
	isGroup: true,
	desc: "Set, get, or remove goodbye message",
	type: "group",
	handler: async (msg, args) => {
		const groupJid = msg.chat;

		if (!args?.trim()) {
			const current = Greetings.goodbye.get(groupJid);
			const state = current ? "ON" : "OFF";
			const text = current || en.plugin.goodbye.none;
			return msg.send(`_Goodbye is ${state}_\n\n${text}`);
		}

		const input = args.trim().toLowerCase();

		if (input === "off") {
			Greetings.goodbye.del(groupJid);
			return msg.send(en.plugin.goodbye.removed);
		}

		if (input === "on") {
			return msg.send(en.plugin.goodbye.no_content);
		}

		Greetings.goodbye.set(groupJid, args);
		return msg.send(en.plugin.goodbye.set);
	},
} satisfies CommandModule;
