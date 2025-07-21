import { AntiCallDb } from "../schema/index.ts";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "anticall",
	fromMe: true,
	isGroup: false,
	desc: "Setup Anticall",
	type: "misc",
	handler: async (msg, args) => {
		const input = args?.toLowerCase()?.trim();

		if (!input || !["on", "off", "block", "warn"].includes(input))
			return msg.send(`Usage: anticall on | off | block | warn`);

		const current = await AntiCallDb.get();

		if (input === "off") {
			if (!current || (current.mode === false && current.action === "warn"))
				return msg.send(en.plugin.anticall.already_off);

			await AntiCallDb.set(false, "warn");
			return msg.send(en.plugin.anticall.set_off);
		}

		if (input === "on") {
			if (current?.mode === true && current.action === "warn")
				return msg.send(en.plugin.anticall.already_set_warn);

			await AntiCallDb.set(true, "warn");
			return msg.send(en.plugin.anticall.set_warn);
		}

		if (["block", "warn"].includes(input)) {
			if (current?.mode === true && current.action === input)
				return msg.send(`_AntiCall is already set to '${input}'._`);

			await AntiCallDb.set(true, input as "block" | "warn");
			return await msg.send(`_AntiCall action set to '${input}'_`);
		}
	},
} satisfies CommandModule;
