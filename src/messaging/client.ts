import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	Browsers,
	fetchLatestBaileysVersion,
} from "baileys";
import { HttpsProxyAgent } from "https-proxy-agent";
import NodeCache from "@cacheable/node-cache";

import config from "../../config.mjs";
import events from "./events.ts";
import hooks from "./hooks.ts";
import useSqliteAuthState from "../utils/useSqliteAuthState.ts";
import { getMessage, cachedGroupMetadata } from "../models/index.ts";

(async () => {
	const { state, saveCreds } = await useSqliteAuthState();
	const { version } = await fetchLatestBaileysVersion();
	const cache = new NodeCache();

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys),
		},
		agent: config.PROXY ? new HttpsProxyAgent(config.PROXY) : undefined,
		version,
		keepAliveIntervalMs: 2000,
		browser: Browsers.windows("chrome"),
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

	if (!sock.authState?.creds?.registered) {
		const phoneNumber = config.USER_NUMBER?.replace(/[^0-9]/g, "") ?? "";
		if (phoneNumber.length < 11) {
			console.error("Please input a valid number");
			process.exit(1);
		}
		await new Promise(resolve => setTimeout(resolve, 2000));
		console.log(`Pairing Code: ${await sock.requestPairingCode(phoneNumber)}`);

		await new Promise<void>(resolve => {
			const isRegistered = setInterval(() => {
				if (sock.authState?.creds?.registered) {
					clearInterval(isRegistered);
					resolve();
				}
			}, 1000);
		});
	}

	await Promise.all([events(sock, { saveCreds }), hooks(sock)]);

	return sock;
})();
