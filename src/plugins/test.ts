import { Command } from '../messaging/plugins.ts';

Command({
 on: 'text',
 function: async (message) => {
  const text = message.data?.text;
  if (!text) return;
  if (text.toLowerCase().trim() === 'hi') {
   return await message.send('hello');
  }
 },
});
