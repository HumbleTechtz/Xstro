import {
	makeWASocket,
	makeCacheableSignalKeyStore,
	fetchLatestWaWebVersion,
	delay,
} from "baileys";
import Cache from "./cache";
import auth from "./auth";
import config from "../config";
import { cachedGroupMetadata } from "./group";

const msgRetryCounterCache = new Cache();

export default async () => {
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
		if (!phone) return console.error("No vaild phone number in the config.");
		await delay(2000);
		console.log(`PAIR-CODE: ${await sock.requestPairingCode(phone, "ASTROX11")}`);
		await new Promise<void>(r => {
			const i = setInterval(
				() => sock.authState?.creds?.registered && (clearInterval(i), r()),
				1000
			);
		});
	}
};
