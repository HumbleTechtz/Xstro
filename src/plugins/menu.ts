import { Command, commands } from '../messaging/plugin.ts';
import { platform, totalmem, freemem } from 'node:os';
import { formatBytes, formatRuntime } from '../utils/constants.ts';

Command({
	name: 'menu',
	fromMe: false,
	desc: 'Show All Commands',
	dontAddCommandList: true,
	function: async message => {
		const cmds = commands.filter(
			cmd =>
				cmd.name &&
				!cmd.dontAddCommandList &&
				!cmd.name.toString().includes('undefined'),
		).length;
		let menuInfo = `\`\`\`╭─── χѕтяσ м∂ ────
│ User: ${message.pushName?.trim() ?? `Unknown`}
│ Owner: αѕтяσχ11
│ Plugins: ${cmds}
│ Mode: ${message.mode ? 'Private' : 'Public'}
│ Uptime: ${formatRuntime(process.uptime())}
│ Platform: ${platform()}
│ Ram: ${formatBytes(totalmem() - freemem())}
│ Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}
│ Date: ${new Date().toLocaleDateString('en-US')}
│ Time: ${new Date().toLocaleTimeString('en-US', { timeZone: process.env.TZ })}
│ Node: ${process.version}
╰─────────────\`\`\`\n`.trim();

		menuInfo += '\n';
		const commandsByType = commands
			.filter(cmd => cmd.name && !cmd.dontAddCommandList)
			.reduce((acc: any, cmd) => {
				const type = cmd.type ?? 'misc';
				if (!acc[type]) {
					acc[type] = [];
				}
				acc[type].push(cmd.name?.toString().toLowerCase().split(/\W+/)[2]);
				return acc;
			}, {});

		const sortedTypes = Object.keys(commandsByType).sort();

		let totalCommands = 1;

		sortedTypes.forEach(type => {
			const sortedCommands = commandsByType[type].sort();
			menuInfo += `╭──── *${type}* ────\n`;
			sortedCommands.forEach((cmd: unknown) => {
				menuInfo += `│${totalCommands}· ${cmd}\n`;
				totalCommands++;
			});
			menuInfo += `╰────────────\n`;
		});
		return await message.send(menuInfo.trim());
	},
});

Command({
	name: 'help',
	fromMe: false,
	isGroup: false,
	desc: 'Get all command names and descriptions',
	dontAddCommandList: true,
	function: async message => {
		let help = '';
		const filteredCommands = commands.filter(cmd => !cmd.dontAddCommandList);

		const commandList = filteredCommands
			.map(cmd => {
				const cmdName = cmd.name?.toString().split(/[\p{S}\p{P}]/gu)[5];
				if (!cmdName) return null;
				return { name: cmdName, desc: cmd.desc || 'No description' };
			})
			.filter(Boolean)
			.sort((a, b) => a!.name.localeCompare(b!.name));

		for (const cmd of commandList) {
			help += `- ${cmd?.name}: ${cmd?.desc}\n`;
		}

		return await message.send(help.trim());
	},
});
