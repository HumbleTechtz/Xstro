import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	fetchLatestWaWebVersion,
	delay,
} from "baileys";
import auth from "./auth";
import cache from "./cache";
import event from "./event";
import config from "../config";
import { cachedGroupMetadata } from "./group";
import { Green, Red } from "../lib";

const msgRetryCounterCache = cache();

const { state, saveCreds } = auth();
const { version } = await fetchLatestWaWebVersion({});

const sock = makeWASocket({
	auth: {
		creds: state.creds,
		keys: makeCacheableSignalKeyStore(state.keys),
	},
	version,
	msgRetryCounterCache,
	cachedGroupMetadata,
});

if (!sock.authState?.creds?.registered) {
	const phone = config.USER_NUMBER?.replace(/\D/g, "") ?? "";
	if (!phone) Red("No vaild phone number in the config."), process.exit(1);
	await delay(2000);
	Green(`PAIR:`, await sock.requestPairingCode(phone, "ASTROX11"));
	await new Promise<void>(r => {
		const i = setInterval(
			() => sock.authState?.creds?.registered && (clearInterval(i), r()),
			1000
		);
	});
}

event(sock, saveCreds);
