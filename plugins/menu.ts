import config from "../config";
import { platform, totalmem, freemem } from "os";
import { commandMap } from "../client/Core";
import { fancy, formatBytes, formatRuntime } from "../client/Utils";
import type { CommandModule } from "../client/Core";

const commands = [...commandMap.values()].filter(c => !c.dontAddCommandList);

export default [
	{
		pattern: "menu",
		fromMe: false,
		desc: "Show All Commands",
		dontAddCommandList: true,
		run: async message => {
			const cmds = commands.filter(cmd => cmd.pattern).length;

			let menuInfo = `\`\`\`╭─── ${config.BOT_NAME ?? `χѕтяσ`} ────
│ User: ${message.pushName?.trim() ?? `Unknown`}
│ Owner: ${config.OWNER_NAME ?? `αѕтяσχ11`}
│ Plugins: ${cmds}
│ Mode: ${message.mode ? "Private" : "Public"}
│ Uptime: ${formatRuntime(process.uptime())}
│ Platform: ${platform()}
│ Ram: ${formatBytes(totalmem() - freemem())}
│ Day: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}
│ Date: ${new Date().toLocaleDateString("en-US")}
│ Time: ${new Date().toLocaleTimeString("en-US", { timeZone: process.env.TZ })}
│ Node: ${process.version}
╰─────────────\`\`\`\n`;

			const byType: Record<string, string[]> = {};

			for (const cmd of commands) {
				const type = cmd.type ?? "misc";
				const name = cmd.pattern?.toLowerCase();
				if (!name) continue;
				if (!byType[type]) byType[type] = [];
				byType[type].push(name);
			}

			let total = 1;
			for (const type of Object.keys(byType).sort()) {
				menuInfo += `╭──── *${fancy(type)}* ────\n`;
				for (const name of byType[type].sort()) {
					menuInfo += `│${fancy(total++)}· ${fancy(name)}\n`;
				}
				menuInfo += `╰────────────\n`;
			}

			return message.send(menuInfo.trim());
		},
	},
	{
		pattern: "help",
		fromMe: false,
		isGroup: false,
		desc: "Get all command names and descriptions",
		dontAddCommandList: true,
		run: async message => {
			const help = commands
				.map(cmd => {
					const name = cmd.pattern;
					if (!name) return null;
					return `- ${name}: ${cmd.desc || "No description"}`;
				})
				.filter(Boolean)
				.sort()
				.join("\n");

			return message.send(help.trim());
		},
	},
] satisfies CommandModule[];
