import { AntiDelDb } from "../schema/index.ts";
import type { CommandModule } from "../../Types/index.ts";
import { en } from "../resources/index.ts";

export default {
	pattern: "antidelete",
	fromMe: true,
	isGroup: false,
	desc: "Recover deleted messages",
	type: "misc",
	handler: async (msg, match) => {
		if (!match) {
			return msg.send(["Usage:", `antidelete on`, `antidelete off`].join("\n"));
		}

		const cmd = match.trim().toLowerCase();

		if (cmd === "on")
			return (await AntiDelDb.set(true))
				? msg.send(en.plugin.antidel.enabled)
				: msg.send(en.plugin.antidel.already_enabled);

		if (cmd === "off")
			return (await AntiDelDb.set(false))
				? msg.send(en.plugin.antidel.disabled)
				: msg.send(en.plugin.antidel.already_disabled);

		return msg.send(["Usage:", `antidelete on`, `antidelete off`].join("\n"));
	},
} satisfies CommandModule;
