import Message from './Messages/Message.ts';
import { commands } from './plugins.ts';
import { log } from '../utils/index.ts';

export async function runCommand(message: Message) {
 if (!message.data.text) return;

 for (const cmd of commands) {
  const handler = message.data.prefix.find((p: string) =>
   message.data.text?.startsWith(p),
  );
  const match = message.data.text
   .slice(handler?.length || 0)
   .match(cmd.name as string);
  if (!handler || !match) continue;

  if (message.mode && !message.sudo) continue;
  if (cmd.fromMe && !message.sudo) {
   await message.send('_This command is for Sudo Only!_');
   continue;
  }
  if (cmd.isGroup && !message.isGroup) {
   await message.send('_This command is for Groups Only!_');
   continue;
  }

  try {
   await message.react('⏳');
   await cmd.function(message, match[2] ?? '');
  } catch (err) {
   log.error(err);
  }
 }
}
