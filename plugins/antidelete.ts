import { Command } from "../client/Core";
import { setAntidelete } from "../client/Models";

Command({
	name: "antidelete",
	fromMe: true,
	isGroup: false,
	desc: "Recover deleted messages",
	type: "misc",
	function: async (msg, match) => {
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
				? msg.send("_Antidelete enabled_")
				: msg.send("_Antidelete is already enabled_");

		if (cmd === "off")
			return setAntidelete(false)
				? msg.send("_Antidelete disabled_")
				: msg.send("_Antidelete is already disabled_");

		return msg.send(
			[
				"Usage:",
				`${msg.prefix[0]}antidelete on`,
				`${msg.prefix[0]}antidelete off`,
			].join("\n")
		);
	},
});
