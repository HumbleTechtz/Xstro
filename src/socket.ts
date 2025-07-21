import makeWASocket, { delay, fetchLatestWaWebVersion } from "baileys";
import auth from "./auth.ts";
import config from "../config.ts";
import registerSocketEvents from "./events.ts";
import { cachedGroupMetadata } from "./group.ts";
import { StoreDb } from "./lib/schema/index.ts";
import { registersocketHooks } from "./lib/hooks/socket.ts";

export default async function startSock() {
	const { state, saveCreds } = await auth();
	const { version } = await fetchLatestWaWebVersion({});

	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: state.keys,
		},
		version,
		cachedGroupMetadata,
		getMessage: StoreDb.get,
	});

	if (!sock?.authState?.creds?.registered) {
		await delay(3000);
		const code = await sock.requestPairingCode(config.USER_NUMBER);
		console.log(`Pairing code:`, code);
	}

	registerSocketEvents(sock, saveCreds);
	registersocketHooks(sock);

	return sock;
}

startSock();
