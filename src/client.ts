import makeWASocket, {
	delay,
	DisconnectReason,
	fetchLatestBaileysVersion,
	useMultiFileAuthState,
} from "baileys";
import { Boom } from "@hapi/boom";
import config from "../config.ts";
import { Base, Message } from "./class/index.ts";

const startSock = async () => {
	const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
	const { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(version, isLatest);

	const sock = makeWASocket({
		auth: state,
	});

	if (!sock.authState.creds.registered) {
		await delay(3000);
		const code = await sock.requestPairingCode(config.NUMBER, config.PAIR_CODE);
		console.log(code);
	}

	sock.ev.on("creds.update", async () => await saveCreds());

	sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
		switch (connection) {
			case "open":
				console.log("opened connection");
				break;
			case "close":
				const reasons = (lastDisconnect.error as Boom).output.statusCode;
				const restartReasons = [
					DisconnectReason.restartRequired,
					DisconnectReason.connectionLost,
					DisconnectReason.connectionClosed,
					DisconnectReason.connectionLost,
				];
				const fatalReasons = [
					DisconnectReason.badSession,
					DisconnectReason.loggedOut,
					DisconnectReason.multideviceMismatch,
				];

				if (restartReasons.includes(reasons)) {
					startSock();
				} else if (fatalReasons.includes(reasons)) {
					process.exit();
				}

				break;
			default:
				break;
		}
	});

	sock.ev.on("messages.upsert", async ({ messages, type }) => {
		if (type !== "notify") return;
		for (const messsage of messages) {
			const msg = new Message(sock, JSON.parse(JSON.stringify(messsage)));
			console.log(msg);
		}
	});

	sock.ev.on("messages.update", async ([{ key, update }]) => {});

	sock.ev.on(
		"messaging-history.set",
		async ({ chats, contacts, messages }) => {}
	);

	sock.ev.on("groups.update", async metadata => {});

	sock.ev.on("groups.upsert", async metadata => {});

	sock.ev.on(
		"group-participants.update",
		async ({ id, author, participants, action }) => {}
	);

	sock.ev.on("call", async ([{ chatId, status, from }]) => {});

	sock.ev.on("presence.update", async ({ id, presences }) => {});

	return sock;
};
startSock();
