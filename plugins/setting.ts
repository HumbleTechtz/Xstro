import { setPrefix, setMode, getMode } from "../client/Models";
import type { CommandModule } from "../client/Core";

export default [
	{
		pattern: "setprefix",
		fromMe: true,
		isGroup: false,
		desc: "Set handler for bot",
		type: "settings",
		run: async (msg, args) => {
			if (!args) return msg.send(`_Usage: ${msg.prefix[0]}setprefix *#,_`);
			setPrefix([...args.split("")]);
			return msg.send(`_Bot prefix updated to "${args}"_\nUsage: ${args[0]}ping`);
		},
	},
	{
		pattern: "mode",
		fromMe: true,
		isGroup: false,
		desc: "Set bot mode",
		type: "settings",
		run: async (msg, match) => {
			const mode = match?.toLowerCase().trim();
			const current = getMode();
			if (!["private", "public"].includes(mode!))
				return msg.send(
					`Usage:\n${msg.prefix[0]}mode private\n${msg.prefix[0]}mode public`
				);
			const updated = mode === "private";
			if (current === updated) return msg.send(`_Mode already in ${mode}_`);
			setMode(updated);
			return msg.send(`_Bot is now in ${mode} mode_`);
		},
	},
] satisfies CommandModule[];
