import { Command } from '../messaging/plugins.ts';
import { setSettings } from '../models/settings.ts';

Command({
 name: 'setprefix',
 fromMe: true,
 isGroup: false,
 desc: 'Set handler for bot',
 type: 'settings',
 function: async (msgs, args) => {
  if (!args) {
   return await msgs.send(
    `_Prefix is needed, eg ${msgs.prefix[0]}setprefix ,_`,
   );
  }
  await setSettings('prefix', [args]);
  return await msgs.send(
   `_Bot Prefix updated to "${args}"_\nUsage: ${args}ping`,
  );
 },
});
