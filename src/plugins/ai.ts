import { chatGpt } from '@astrox11/utily';
import { Command } from '../messaging/plugins.ts';

Command({
 name: 'gpt',
 fromMe: false,
 isGroup: false,
 desc: 'Chat with Open Ai Gpt',
 type: 'ai',
 function: async (message, match) => {
  if (!match) {
   return message.send(`_${message.pushName} How can I help You?_`);
  }
  return await message.send(await chatGpt(match));
 },
});
