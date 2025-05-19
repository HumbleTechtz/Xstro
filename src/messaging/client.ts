import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	Browsers,
	fetchLatestBaileysVersion,
	delay,
} from 'baileys';
import { pino } from 'pino';
import { HttpsProxyAgent } from 'https-proxy-agent';
import NodeCache from '@cacheable/node-cache';

import config from '../../config.mjs';
import emit from './emit.ts';
import hooks from './hooks.ts';
import useSqliteAuthState from '../utils/useSqliteAuthState.ts';
import { getMessage, cachedGroupMetadata } from '../models/index.ts';

(async () => {
	const { state, saveCreds } = await useSqliteAuthState();
	const { version } = await fetchLatestBaileysVersion();
	const cache = new NodeCache();
	const logger = pino({ level: 'silent' });

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		agent: config.PROXY ? new HttpsProxyAgent(config.PROXY) : undefined,
		logger,
		version,
		keepAliveIntervalMs: 2000,
		browser: Browsers.windows('chrome'),
		emitOwnEvents: true,
		generateHighQualityLinkPreview: true,
		linkPreviewImageThumbnailWidth: 1920,
		msgRetryCounterCache: cache,
		mediaCache: cache,
		userDevicesCache: cache,
		callOfferCache: cache,
		getMessage,
		cachedGroupMetadata,
	});

	// Step 1: Pairing
	if (!sock.authState?.creds?.registered) {
		const phoneNumber = config.USER_NUMBER?.replace(/[^0-9]/g, '') ?? '';
		if (phoneNumber.length < 11) {
			console.error('Please input a valid number');
			process.exit(1);
		}
		await delay(3000);
		const code = await sock.requestPairingCode(phoneNumber);
		console.log(`Pair Code: ${code}`);

		// Wait for the pairing to complete before continuing
		await new Promise<void>(resolve => {
			const checkRegistered = setInterval(() => {
				if (sock.authState?.creds?.registered) {
					clearInterval(checkRegistered);
					resolve();
				}
			}, 1000);
		});
	}

	// Step 2: Parallel execution of emit and hooks after pairing/connection
	await Promise.all([emit(sock, { saveCreds }), hooks(sock)]);

	return sock;
})();
