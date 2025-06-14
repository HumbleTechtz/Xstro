import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	Browsers,
	fetchLatestBaileysVersion,
} from "baileys";
import * as P from "pino";
import { HttpsProxyAgent } from "https-proxy-agent";
import NodeCache from "@cacheable/node-cache";

import config from "../../config.ts";
import events from "./events.ts";
import hooks from "./hooks.ts";
import useSqliteAuthState from "../Utils/useSqliteAuthState.ts";
import { pairClient } from "./pair.ts";
import { getMessage, cachedGroupMetadata } from "../Models/index.ts";
import { startServer } from "./network.ts";

(async () => {
	const cache = new NodeCache();
	const logger = P.pino({ level: "silent" });
	const { state, saveCreds } = await useSqliteAuthState();
	const { version } = await fetchLatestBaileysVersion();
	startServer(config.PORT);

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
		agent: config.PROXY ? new HttpsProxyAgent(config.PROXY) : undefined,
		version,
		logger,
		keepAliveIntervalMs: 2000,
		browser: Browsers.windows("FireFox"),
		syncFullHistory: true,
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

	await pairClient(sock);

	await Promise.all([events(sock, { saveCreds }), hooks(sock)]);

	return sock;
})();
