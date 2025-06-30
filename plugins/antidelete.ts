import { setAntidelete } from "../core/Models";
import type { CommandModule } from "../core/Core";

export default {
	pattern: "antidelete",
	fromMe: true,
	isGroup: false,
	desc: "Recover deleted messages",
	type: "misc",
	run: async (msg, match) => {
		if (!match) {
			return msg.send(
				[
					"Usage:",
					`${msg.prefix[0]}antidelete on`,
					`${msg.prefix[0]}antidelete off`,
				].join("\n")
			);
		}

		const cmd = match.trim().toLowerCase();

		if (cmd === "on")
			return setAntidelete(true)
				? msg.send("Antidelete enabled.")
				: msg.send("Antidelete is already enabled.");

		if (cmd === "off")
			return setAntidelete(false)
				? msg.send("Antidelete disabled.")
				: msg.send("Antidelete is already disabled.");

		return msg.send(
			[
				"Usage:",
				`${msg.prefix[0]}antidelete on`,
				`${msg.prefix[0]}antidelete off`,
			].join("\n")
		);
	},
} satisfies CommandModule;
