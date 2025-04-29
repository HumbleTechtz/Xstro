import { Command, commands } from '../messaging/plugins.ts';
import { platform, totalmem, freemem } from 'node:os';
import type { Commands } from '../types/bot.ts';
import { formatBytes, formatRuntime } from '../utils/constants.ts';
import { cwd } from 'node:process';

Command({
 name: 'menu',
 fromMe: false,
 isGroup: false,
 desc: 'Get all command names by category',
 type: 'utilities',
 dontAddCommandList: true,
 function: async (message) => {
  let menu = `\`\`\`╭─── χѕтяσ м∂ ────
│ User: ${message.pushName?.trim() ?? `Unknown`}
│ Owner: αѕтяσχ11
│ Mode: ${message.mode ? 'Private' : 'Public'}
│ Uptime: ${formatRuntime(process.uptime())}
│ Platform: ${platform()}
│ Ram: ${formatBytes(totalmem() - freemem())}
│ Day: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}
│ Date: ${new Date().toLocaleDateString('en-US')}
│ Time: ${new Date().toLocaleTimeString('en-US', { timeZone: process.env.TZ })}
│ Node: ${process.version}
╰─────────────\`\`\``.trim();
  const filteredCommands = commands.filter((cmd) => !cmd.dontAddCommandList);

  const groupedCommands: Record<Commands['type'], string[]> =
   filteredCommands.reduce(
    (acc: Record<Commands['type'], string[]>, cmd: Commands) => {
     const cmdName = cmd.name?.toString().split(/[\p{S}\p{P}]/gu)[5];
     if (!cmdName) return acc;
     const type: Commands['type'] = (cmd.type || 'misc') as Commands['type'];
     if (!acc[type]) acc[type] = [];
     acc[type].push(cmdName);
     return acc;
    },
    {} as Record<Commands['type'], string[]>,
   );

  const sortedCategories = Object.keys(
   groupedCommands,
  ).sort() as Commands['type'][];

  for (const category of sortedCategories) {
   menu += `\n=== ${category} ===\n`;
   const sortedCommands = groupedCommands[category].sort();
   for (const cmd of sortedCommands) {
    menu += `- _${cmd}_\n`;
   }
  }

  return await message.send(menu.trim(), {
   contextInfo: {
    externalAdReply: {
     title: 'αѕтяσχ11',
     body: message.pushName ?? '',
     thumbnail: await (
      await import('node:fs/promises')
     ).readFile(`${cwd()}/src/media/logo.png`),
     mediaType: 1,
     sourceUrl: 'https://github.com/AstroX11/Xstro',
     showAdAttribution: true,
    },
   },
  });
 },
});

Command({
 name: 'help',
 fromMe: false,
 isGroup: false,
 desc: 'Get all command names and descriptions',
 type: 'utilities',
 dontAddCommandList: true,
 function: async (message) => {
  let help = '';
  const filteredCommands = commands.filter((cmd) => !cmd.dontAddCommandList);

  const commandList = filteredCommands
   .map((cmd) => {
    const cmdName = cmd.name?.toString().split(/[\p{S}\p{P}]/gu)[5];
    if (!cmdName) return null;
    return { name: cmdName, desc: cmd.desc || 'No description' };
   })
   .filter((cmd) => cmd !== null);

  const sortedCommands = commandList.sort((a, b) =>
   a.name.localeCompare(b.name),
  );

  for (const cmd of sortedCommands) {
   help += `- ${cmd.name}: ${cmd.desc}\n`;
  }

  return await message.send(help.trim());
 },
});
