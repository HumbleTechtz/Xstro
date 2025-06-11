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

		await setPrefix([...args.split("")]);
		return await msg.send(
			`_Bot prefix updated to "${args}"_\nUsage: ${args.split("")[0]}ping`,
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

		const mode = match.toLowerCase().trim();
		const newMode = mode === "private";
		const currentMode = await getMode();

		if (currentMode === newMode) {
			return await msg.send(
				`_Already in ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode_`,
			);
		}

		await setMode(newMode);
		return await msg.send(`_Bot is now in ${mode} mode_`);
	},
});
