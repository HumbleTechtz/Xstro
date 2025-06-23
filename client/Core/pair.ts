/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Pairing client for WhatsApp bot using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import config from "../../config.js";
import { shutdown } from "../Utils/constants";
import type { WASocket } from "baileys";

export default async function (sock: WASocket) {
	if (!sock.authState?.creds?.registered) {
		const phoneNumber = config.USER_NUMBER?.replace(/[^0-9]/g, "") ?? "";
		if (phoneNumber.length < 11) {
			console.error("Invalid phone number. Please provide a valid phone number in the config.");
			shutdown();
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
}
