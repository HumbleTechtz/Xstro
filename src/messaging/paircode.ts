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

export async function getPairingCode() {
	if (!config.USER_NUMBER) {
		print.fail(
			'NO NUMBER FOUND!\nPLEASE INPUT YOUR WHATSAPP PHONE NUMBER IN USER_NUMBER VARIABLE.',
		);
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
				browser: Browsers.windows('chrome'),
			});

			if (!conn.authState.creds.registered) {
				let phoneNumber = config.USER_NUMBER?.replace(/[^0-9]/g, '') ?? '';
				if (phoneNumber.length < 11) {
					print.fail('BAD PHONE NUMBER, ILLEGAL!');
					process.exit(1);
					return reject(new Error('invaild whatsapp number'));
				}

				setTimeout(async () => {
					let code = await conn.requestPairingCode(phoneNumber);
					print.succeed(`PAIRING CODE: ${code}`);
					resolve(code);
				}, 3000);
			}

			conn.ev.on('creds.update', saveCreds);

			conn.ev.on('connection.update', async update => {
				const { connection, lastDisconnect } = update;

				if (connection === 'open') {
					if (conn.user?.id) {
						await conn.sendMessage(conn.user.id, {
							text: '```Initail Session Sucessfully Loaded```',
						});
						process.exit(1);
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
						print.info('RESTARTING PAIRING...');
						getPairingCode();
					} else {
						print.fail(`PAIR FAILED, REASON UNKNOWN.`);
						process.exit();
					}
				}
			});

			conn.ev.on('messages.upsert', () => {});
		} catch (error) {
			reject(error);
		}
	});
}

await getPairingCode();
