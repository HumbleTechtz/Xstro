import { Command } from '../messaging/plugins.ts';
import { setAntiWord, delAntiword, getAntiword } from '../models/antiword.ts';

Command({
 name: 'antiword',
 fromMe: false,
 isGroup: true,
 type: 'group',
 function: async (message, match) => {
  const jid = message.jid;

  if (!match) {
   return message.send(
    `Usage:
${message.prefix[0]}antiword on — Enable the antiword filter
${message.prefix[0]}antiword off — Disable the antiword filter
${message.prefix[0]}antiword get — Show the current list of blocked words
${message.prefix[0]}antiword set word1, word2, word3 — Set the list of blocked words (comma-separated)`,
   );
  }

  const args = match.trim().split(' ');
  const command = args.shift()?.toLowerCase();

  switch (command) {
   case 'on':
    await setAntiWord(jid, true, []);
    return message.send('_Antiword filter has been enabled._');

   case 'off':
    await setAntiWord(jid, false, []);
    return message.send('_Antiword filter has been disabled._');

   case 'get': {
    const record = await getAntiword(jid);
    if (!record || !record.words.length) {
     return message.send('_No blocked words are set._');
    }
    return message.send(
     `📛 Blocked words (${record.words.length}):\n${record.words.join(', ')}`,
    );
   }

   case 'set': {
    if (!args.length) {
     return message.send('_Provide a list of words to block._');
    }

    const words = args
     .join(' ')
     .split(',')
     .map((word) => word.trim())
     .filter(Boolean);

    if (!words.length) {
     return message.send('⚠️ Invalid input. No valid words detected.');
    }

    const result = await setAntiWord(jid, true, words);
    return message.send(
     `✅ Antiword list updated with ${result?.words} word(s).`,
    );
   }

   default:
    return message.send(
     '❓ Invalid command. Use "on", "off", "get", or "set".',
    );
  }
 },
});
