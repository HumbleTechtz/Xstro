import { Command } from '../messaging/plugins.ts';
import { formatRuntime } from '../utils/constants.ts';

Command({
 name: 'ping',
 fromMe: false,
 isGroup: false,
 desc: 'Ping the bot',
 type: 'system',
 function: async (message) => {
  const start = Date.now();
  const msg = await message.send('Pong!');
  const end = Date.now();
  return await msg.edit(`\`\`\`${end - start} ms\`\`\``);
 },
});

Command({
 name: 'runtime',
 fromMe: false,
 isGroup: false,
 desc: 'Get bot runtime',
 type: 'system',
 function: async (message) => {
  return await message.send(`\`\`\`${formatRuntime(process.uptime())}\`\`\``);
 },
});
