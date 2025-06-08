import { Command } from "../../src/Core/plugin.ts";
import { setPrefix, setMode, getMode } from "../../src/Models/index.ts";

Command({
	name: "setprefix",
	fromMe: true,
	isGroup: false,
	desc: "Set handler for bot",
	type: "settings",
	function: async (msg, args) => {
		if (!args) {
			return await msg.send(
				`_Prefix is needed, e.g. ${msg.prefix[0]}setprefix ,_`,
			);
		}

		await setPrefix([args]);
		return await msg.send(
			`_Bot prefix updated to "${args}"_\nUsage: ${args}ping`,
		);
	},
});

Command({
	name: "mode",
	fromMe: true,
	isGroup: false,
	desc: "Set bot mode to be public or private",
	type: "settings",
	function: async (msg, match) => {
		if (!match || !["private", "public"].includes(match.toLowerCase())) {
			return msg.send(
				`*Usage:*\n${msg.prefix[0]}mode private\n${msg.prefix[0]}mode public`,
			);
		}

		const currentMode = await getMode();
		if (currentMode && match.toLowerCase() === "private") {
			return await msg.send("_Already in Private Mode_");
		} else if (!currentMode && match.toLowerCase() === "public") {
			return await msg.send("_Already in Public Mode_");
		}

		const newMode = match.toLowerCase() === "private";
		await setMode(newMode);

		return await msg.send(`_Bot is now in ${match.toLowerCase()} mode_`);
	},
});
