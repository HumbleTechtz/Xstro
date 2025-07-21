import { Boom } from "@hapi/boom";
import { sqlite, Green, Yellow, del } from "..";
import { delay, type BaileysEventMap } from "baileys";
import QRCode from "qrcode-terminal";

// Add a callback to recreate the socket
let recreateSocket: (() => void) | null = null;

export const setSocketRecreator = (callback: () => void) => {
	recreateSocket = callback;
};

export default async (ev: BaileysEventMap["connection.update"]) => {
	const { connection, lastDisconnect, qr } = ev;

await delay(3000)

	console.log(connection, lastDisconnect, qr);

	if (qr) {
		QRCode.generate(qr, { small: true });
	}

	switch (connection) {
		case "connecting":
			Yellow("connecting...");
			break;
		case "close":
			const error = lastDisconnect?.error as Boom;
			const reason = error?.output?.statusCode;

			// Only delete auth and exit for unauthorized (401)
			if (reason === 401) {
				sqlite.run("DELETE FROM auth");
				process.exit();
				break;
			}

			// For restart required (515), recreate socket instead of exiting
			if (reason === 515) {
			await delay(3000)
				Yellow("Restart required, recreating socket...");
				if (recreateSocket) {
					setTimeout(recreateSocket, 2000); // Wait 2 seconds then recreate
				}
				break;
			}

			// For other errors, try to recreate socket first before exiting
			console.log("Connection closed with reason:", reason);
			if (recreateSocket) {
				Yellow("Connection lost, attempting to reconnect...");
				setTimeout(recreateSocket, 5000);
			} else {
				process.exit();
			}
			break;
		case "open":
			Green("connection open.");
			break;
	}
};