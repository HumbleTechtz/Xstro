import { GroupDb } from "../schema/index.ts";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "event",
	aliases: ["events"],
	fromMe: true,
	isGroup: true,
	desc: "Enable or disable group event mode",
	type: "group",
	handler: async (msg, args) => {
		const groupJid = msg.chat;

		if (!args?.trim()) {
			const state = GroupDb.get(groupJid) ? "on" : "off";
			return msg.send(`Group events set: ${state}`);
		}

		const mode = args.trim().toLowerCase();

		if (mode === "on") {
			GroupDb.set(groupJid, true);
			return msg.send(en.plugin.event.enabled);
		}

		if (mode === "off") {
			GroupDb.remove(groupJid);
			return msg.send(en.plugin.event.disabled);
		}

		return msg.send(en.plugin.event.usage);
	},
} satisfies CommandModule;
