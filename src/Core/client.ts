import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	Browsers,
	fetchLatestBaileysVersion,
} from "baileys";
import { pino } from "pino";
import { HttpsProxyAgent } from "https-proxy-agent";
import NodeCache from "@cacheable/node-cache";

import config from "../../config.ts";
import events from "./events.ts";
import hooks from "./hooks.ts";
import useSqliteAuthState from "../Utils/useSqliteAuthState.ts";
import { pairClient } from "./pair.ts";
import { getMessage, cachedGroupMetadata } from "../Models/index.ts";

export default async function createWhatsAppSocket() {
	const cache = new NodeCache();
	const { state, saveCreds } = await useSqliteAuthState();
	const { version } = await fetchLatestBaileysVersion();
	const logger = pino({ level: "silent" });

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys),
		},
		browser: Browsers.ubuntu("Safari"),
		agent: config.PROXY ? new HttpsProxyAgent(config.PROXY) : undefined,
		version,
		logger,
		keepAliveIntervalMs: 2000,
		mediaCache: cache,
		emitOwnEvents: true,
		syncFullHistory: true,
		msgRetryCounterCache: cache,
		getMessage,
		cachedGroupMetadata,
	});

	await pairClient(sock);
	await Promise.all([events(sock, { saveCreds }), hooks(sock)]);

	return sock;
}

createWhatsAppSocket()