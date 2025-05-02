import { Command } from '../messaging/plugins.ts';
import { setAntidelete } from '../models/antidelete.ts';

Command({
 name: 'antidelete',
 fromMe: true,
 isGroup: false,
 desc: 'Recover deleted messages',
 type: 'misc',
 function: async (message, match) => {
  const p = message.prefix[0];
  if (!match) {
   return message.send(
    `*Usage:*\n${p}antidelete on\n${p}antidelete off\n${p}antidelete set dm\n${p}antidelete set gc`,
   );
  }

  const [cmd, subCmd, mode] = match.split(' ').map((lt) => lt.toLowerCase());

  if (cmd === 'on') {
   const rec = await setAntidelete('global');
   return rec
    ? message.send('_Antidelete is now enabled_')
    : message.send('_Antidelete was already enabled_');
  }

  if (cmd === 'off') {
   const rec = await setAntidelete(null);
   return rec
    ? message.send('_Antidelete turned off_')
    : message.send('_Antidelete was already disabled_');
  }

  if (cmd === 'set' && mode === 'gc') {
   await setAntidelete('gc');
   return message.send('_Antidelete is now enabled for only group chats_');
  }

  if (cmd === 'set' && mode === 'dm') {
   await setAntidelete('dm');
   return message.send('_Antidelete is now enabled for only personal chats_');
  }

  return message.send(
   `*Usage:*\n${p}antidelete on\n${p}antidelete off\n${p}antidelete set dm\n${p}antidelete set gc`,
  );
 },
});
