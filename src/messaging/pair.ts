import {
	Browsers,
	delay,
	DisconnectReason,
	makeCacheableSignalKeyStore,
	makeWASocket,
} from 'baileys';
import { pino } from 'pino';
import { Boom } from '@hapi/boom';

import config from '../../config.mjs';
import lang from '../utils/lang.ts';
import useSqliteAuthState, { auth } from '../utils/useSqliteAuthState.ts';

(async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const logger = pino({ level: 'silent' });
			const { state, saveCreds } = await useSqliteAuthState();

			const conn = makeWASocket({
				auth: {
					creds: state.creds,
					keys: makeCacheableSignalKeyStore(state.keys, logger),
				},
				browser: Browsers.windows('chrome'),
			});

			if (!conn.authState.creds.registered) {
				let phoneNumber = config.USER_NUMBER?.replace(/[^0-9]/g, '') ?? '';
				if (phoneNumber.length < 11) {
					await delay(2000);
					console.error('Please input a valid number');
					process.exit(1);
				}

				setTimeout(async () => {
					let code = await conn.requestPairingCode(phoneNumber);
					console.log(`Pair Code: ${code}`);
					resolve(code);
				}, 3000);
			}

			conn.ev.on('creds.update', saveCreds);

			conn.ev.on('connection.update', async update => {
				const { connection, lastDisconnect } = update;

				if (connection === 'open') {
					if (conn?.user?.id) {
						setTimeout(async () => {
							await conn.sendMessage(conn.user!.id, {
								text: lang.SESSION_INFO,
							});
							setTimeout(() => {
								process.exit(1);
							}, 2000);
						}, 2000);
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
						console.info('Repairing...');
						process.exit();
					} else {
						console.log('Something went wrong', reason);
						await auth.truncate();
						console.log('Cleared auth state');
						console.log('Please re-pair again');
						process.exit();
					}
				}
			});

			conn.ev.on('messaging-history.set', async event => {
				console.log('Messaging history set', { ...event });
			});
		} catch (error) {
			reject(error);
		}
	});
})();
