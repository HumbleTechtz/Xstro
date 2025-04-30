import { Command } from '../messaging/plugins.ts';
import { setAntiWord, delAntiword, getAntiword } from '../models/antiword.ts';

Command({
 name: 'antiword',
 fromMe: false,
 isGroup: true,
 type: 'group',
 function: async (message, match) => {
  if (!match) {
   return message.send(
    `Usage:
  ${message.prefix[0]}antiword on  – Enable the antiword filter
  
  ${message.prefix[0]}antiword off       – Disable the antiword filter

  ${message.prefix[0]}antiword get       – Show the current list of blocked words

  ${message.prefix[0]}antiword set word1, word2, word3 – Set the list of blocked words (comma-separated)`.trim(),
   );
  }
 },
});
