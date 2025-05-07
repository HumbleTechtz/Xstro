import {
 Browsers,
 DisconnectReason,
 makeCacheableSignalKeyStore,
 makeWASocket,
} from 'baileys';
import { pino } from 'pino';
import { Boom } from '@hapi/boom';
import { useSqliteAuthState } from '../utils/storage.ts';
import { print } from '../utils/constants.ts';
import config from '../../config.ts';

export async function getPairingCode(phone?: string) {
 if (!phone) {
  console.log('no phone. bye');
  return process.exit();
 }

 return new Promise(async (resolve, reject) => {
  try {
   const logger = pino({ level: 'silent' });
   const { state, saveCreds } = await useSqliteAuthState();

   const conn = makeWASocket({
    auth: {
     creds: state.creds,
     keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: false,
    browser: Browsers.windows('Chrome'),
   });

   if (!conn.authState.creds.registered) {
    let phoneNumber = phone ? phone.replace(/[^0-9]/g, '') : '';
    if (phoneNumber.length < 11) {
     console.log(`bad phone (${phoneNumber}). bye`);
     process.exit(1);
     return reject(new Error('bad phone'));
    }

    console.log(`pairing for: ${phoneNumber}`);
    setTimeout(async () => {
     let code = await conn.requestPairingCode(phoneNumber);
     console.log(`got code: ${code}`);
     resolve(code);
    }, 3000);
   }

   conn.ev.on('creds.update', saveCreds);

   conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
     console.log('conn up');
     if (conn.user?.id) {
      console.log(`msg to: ${conn.user.id}`);
      await conn.sendMessage(conn.user.id, {
       text: '```ready```',
      });
      console.log('msg sent. bye');
      process.exit(1);
     }
    }

    if (connection === 'close') {
     const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
     console.log(`conn down. code: ${reason}`);

     const resetReasons = [
      DisconnectReason.connectionClosed,
      DisconnectReason.connectionLost,
      DisconnectReason.timedOut,
      DisconnectReason.connectionReplaced,
     ];
     const resetWithClearStateReasons = [
      DisconnectReason.loggedOut,
      DisconnectReason.badSession,
     ];

     if (resetReasons.includes(reason)) {
      console.log('temp down. bye');
      process.exit();
     } else if (resetWithClearStateReasons.includes(reason)) {
      console.log('wipe needed. bye');
      process.exit();
     } else if (reason === DisconnectReason.restartRequired) {
      console.log('need restart...');
      getPairingCode(phone);
     } else {
      console.log('bad reason. bye');
      process.exit();
     }
    }
   });

   conn.ev.on('messages.upsert', () => {});
  } catch (error) {
   console.log('err caught:');
   print.fail(JSON.stringify(error));
   reject(new Error('fail'));
  }
 });
}

console.log(await getPairingCode(config.USER_NUMBER));
