import config from "../../config";
import { platform, totalmem, freemem } from "os";
import { commandMap } from "../client";
import { fancy, formatBytes, formatRuntime } from "../common";
import type { CommandModule } from "../client";

const getUniqueCommands = () => {
	const seen = new Set<string>();
	const unique: CommandModule[] = [];

	for (const cmd of commandMap.values()) {
		if (!cmd.dontAddCommandList && cmd.pattern && !seen.has(cmd.pattern)) {
			seen.add(cmd.pattern);
			unique.push(cmd);
		}
	}

	return unique;
};

export default [
	{
		pattern: "menu",
		fromMe: false,
		desc: "Show All Commands",
		dontAddCommandList: true,
		run: async message => {
			const commands = getUniqueCommands();

			let menuInfo = `\`\`\`╭─── ${config.BOT_NAME ?? `χѕтяσ`} ────
│ User: ${message.pushName?.trim() ?? `Unknown`}
│ Plugins: ${commands.length}
│ Mode: ${message.mode ? "Private" : "Public"}
│ Uptime: ${formatRuntime(process.uptime())}
│ Platform: ${platform()}
│ Ram: ${formatBytes(totalmem() - freemem())}
│ Day: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}
│ Date: ${new Date().toLocaleDateString("en-US")}
│ Time: ${new Date().toLocaleTimeString("en-US", { timeZone: process.env.TZ })}
╰─────────────\`\`\`\n`;

			const byType: Record<string, string[]> = {};

			for (const cmd of commands) {
				const type = cmd.type ?? "misc";
				const name = cmd.pattern?.toLowerCase();
				byType[type] = byType[type] || [];
				byType[type].push(name!);
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
			const commands = getUniqueCommands();

			const help = commands
				.map(cmd => `- ${cmd.pattern}: ${cmd.desc || "No description"}`)
				.sort()
				.join("\n");

			return message.send(help.trim());
		},
	},
] satisfies CommandModule[];
