/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Main entry point for creating and configuring the WhatsApp socket connection.
 * @copyright Copyright (c) 2025 AstroX11
 */

import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	Browsers,
	fetchLatestBaileysVersion,
} from "baileys";

import events from "./events";
import hooks from "./hooks";
import pair from "./pair";
import useSqliteAuthState from "../Models/AuthState";
import { getMessage, cachedGroupMetadata } from "../Models";
import { MemoryCache, Logger } from "../Utils";

(async () => {
	const cache = new MemoryCache();
	const { state, saveCreds } = await useSqliteAuthState();
	const { version } = await fetchLatestBaileysVersion();
	const logger = Logger("silent");

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger, cache),
		},
		browser: Browsers.ubuntu("Safari"),
		version,
		logger,
		mediaCache: cache,
		emitOwnEvents: true,
		syncFullHistory: false,
		shouldSyncHistoryMessage: () => false,
		msgRetryCounterCache: cache,
		getMessage,
		cachedGroupMetadata,
	});

	await pair(sock);
	await Promise.all([events(sock, { saveCreds }), hooks(sock)]);

	return sock;
})().catch(error => {
	console.error("Client ERROR:", error);
	process.exit(1);
});
