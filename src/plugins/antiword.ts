import { Command } from '../messaging/plugins.ts';
import { setAntiWord, getAntiword } from '../models/antiword.ts';
import { parseJid } from '../utils/constants.ts';

Command({
 name: 'antiword',
 fromMe: false,
 isGroup: true,
 type: 'group',
 function: async (message, match) => {
  const jid = message.jid;
  const prefix = message.prefix[0];

  if (!match) {
   return message.send(`Usage:
${prefix}antiword on/off — Enable/Disable the filter
${prefix}antiword get — Show blocked words
${prefix}antiword set word1, word2 — Set blocked words`);
  }

  const [cmd, ...rest] = match.trim().split(' ');
  const lcCmd = cmd?.toLowerCase();

  if (lcCmd === 'on' || lcCmd === 'off') {
   await setAntiWord(jid, lcCmd === 'on', []);
   return message.send(
    `_Antiword filter has been ${lcCmd === 'on' ? 'enabled' : 'disabled'}._`,
   );
  }

  if (lcCmd === 'get') {
   const { words = [] } = (await getAntiword(jid)) || {};
   return message.send(
    words.length
     ? `📛 Blocked words (${words.length}):\n${words.join(', ')}`
     : '_No blocked words are set._',
   );
  }

  if (lcCmd === 'set') {
   const words = rest
    .join(' ')
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);
   if (!words.length) return message.send('_No valid words detected._');
   await setAntiWord(jid, true, words);
   return message.send(`_Antiword list updated with ${words.length} word(s)._`);
  }

  return message.send('❓ Invalid command. Use "on", "off", "get", or "set".');
 },
});

Command({
 on: true,
 function: async (msg) => {
  if (
   !msg.isGroup ||
   !msg.data?.text ||
   msg.sender === msg.owner
  )
   return;
  if (!(await msg.isBotAdmin()) || (await msg.isAdmin())) return;

  const record = await getAntiword(msg.jid);
  if (!record?.status || !record.words?.length) return;

  const lowerText = msg.data.text.toLowerCase();
  const matched = record.words.find((word: string) => {
   return new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(lowerText);
  });

  if (matched) {
   await msg.send(`_🚫 The word "${matched}" is not allowed here._`);
   await msg.delete();
  }
 },
});

export function escapeRegex(text: string): string {
 return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
