import { Command } from "../client/Core";
import { setPrefix, setMode, getMode } from "../client/Models";

Command({
	name: "setprefix",
	fromMe: true,
	isGroup: false,
	desc: "Set handler for bot",
	type: "settings",
	function: async (msg, args) => {
		if (!args) return msg.send(`_Usage: ${msg.prefix[0]}setprefix *#,_`);
		await setPrefix([...args.split("")]);
		return msg.send(`_Bot prefix updated to "${args}"_\nUsage: ${args[0]}ping`);
	},
});

Command({
	name: "mode",
	fromMe: true,
	isGroup: false,
	desc: "Set bot mode",
	type: "settings",
	function: async (msg, match) => {
		const mode = match?.toLowerCase().trim();
		const current = await getMode();
		if (!["private", "public"].includes(mode!))
			return msg.send(
				`Usage:\n` +
					`${msg.prefix[0]}mode private\n` +
					`${msg.prefix[0]}mode public`
			);
		const updated = mode === "private";
		if (current === updated) return msg.send(`_Mode already in ${mode}_`);
		await setMode(updated);
		return msg.send(`_Bot is now in ${mode} mode_`);
	},
});
