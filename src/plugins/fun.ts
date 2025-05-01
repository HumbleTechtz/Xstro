import { fetch } from '@astrox11/utily';
import { Command } from '../messaging/plugins.ts';

Command({
 name: 'rizz',
 fromMe: false,
 isGroup: false,
 type: 'fun',
 function: async (msg) => {
  const data = JSON.parse(await fetch('https://rizzapi.vercel.app/random')) as {
   text: string;
  };
  return await msg.send(data.text);
 },
});
