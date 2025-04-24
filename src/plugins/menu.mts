import { Command, commands } from '../messaging/plugins.ts';
import type { Commands } from '../types/index.ts';

Command({
 name: 'menu',
 fromMe: false,
 isGroup: false,
 desc: 'Get all command names by category',
 type: 'utilities',
 dontAddCommandList: true,
 function: async (message) => {
  let menu = '';
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
   menu += `=== ${category} ===\n`;
   const sortedCommands = groupedCommands[category].sort();
   for (const cmd of sortedCommands) {
    menu += `- ${cmd}\n`;
   }
   menu += '\n';
  }

  return await message.send(menu.trim());
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
