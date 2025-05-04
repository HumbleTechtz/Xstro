import {
 Browsers,
 delay,
 DisconnectReason,
 fetchLatestBaileysVersion,
 makeCacheableSignalKeyStore,
 makeWASocket,
} from 'baileys';
import { pino } from 'pino';
import { Boom } from '@hapi/boom';
import { useSqliteAuthState } from '../utils/storage.ts';
import { print } from '../utils/constants.ts';
import config from '../../config.ts';

export async function getPairingCode(phone: string) {
 if (!phone) return process.exit();
 return new Promise(async (resolve, reject) => {
  try {
   const logger = pino({ level: 'silent' });
   const { state, saveCreds } = await useSqliteAuthState();
   const { version } = await fetchLatestBaileysVersion();

   const conn = makeWASocket({
    auth: {
     creds: state.creds,
     keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: true,
    browser: Browsers.ubuntu('Chrome'),
    logger,
    version,
   });

   if (!conn.authState.creds.registered) {
    let phoneNumber = phone ? phone.replace(/[^0-9]/g, '') : '';
    if (phoneNumber.length < 11)
     return reject(new Error('Enter Valid Phone Number'));

    setTimeout(async () => {
     let code = await conn.requestPairingCode(phoneNumber);
     resolve(code);
    }, 3000);
   }

   conn.ev.on('creds.update', saveCreds);
   conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
     if (conn.user?.id) {
      await conn.sendMessage(conn.user.id, {
       text: '```Session Initalized```',
      });
      process.exit();
     }
    }

    if (connection === 'close') {
     const reason = new Boom(lastDisconnect?.error)?.output.statusCode;

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
      process.exit();
     } else if (resetWithClearStateReasons.includes(reason)) {
      process.exit();
     } else if (reason === DisconnectReason.restartRequired) {
      getPairingCode(phone);
     } else {
      process.exit();
     }
    }
   });

   conn.ev.on('messages.upsert', () => {});
  } catch (error) {
   print.fail(JSON.stringify(error));
   reject(new Error('An Error Occurred'));
  }
 });
}

console.log(`PAIRING CODE:`, await getPairingCode(config.NUMBER));
