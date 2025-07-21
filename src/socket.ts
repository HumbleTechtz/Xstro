import makeWASocket, { delay, fetchLatestWaWebVersion } from "baileys";
import auth from "./auth.ts";
import config from "../config.ts";
import registerSocketEvents from "./events.ts";
import { cachedGroupMetadata } from "./group.ts";
import { logger } from "./lib/utils/logger.ts";
import { Green } from "./lib/utils/console.ts";
import { StoreDb } from "./lib/schema/index.ts";
import { registersocketHooks } from "./lib/hooks/socket.ts";

export default async function startSock() {
	const { state } = await auth();
	const { version } = await fetchLatestWaWebVersion({});

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: state.keys,
		},
		version,
		logger,
		cachedGroupMetadata,
		getMessage: StoreDb.get,
	});

	if (!sock?.authState?.creds?.registered) {
		await delay(3000);
		const code = await sock.requestPairingCode(config.USER_NUMBER);
		Green(`PAIR CODE: ${code}`);
	}

	registerSocketEvents(sock);
	registersocketHooks(sock);

	return sock;
}

startSock();
