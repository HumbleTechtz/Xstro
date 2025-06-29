/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Controller for handling message deletion events in WhatsApp bot using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import { isJidGroup } from "baileys";
import { forwardMessage } from "../Core/send_msg";
import { getAntidelete, loadMessage } from "../Models";
import type { BaileysEventMap, WASocket } from "baileys";

export default class {
	protected client: WASocket;
	protected update: BaileysEventMap["messages.delete"];
	constructor(client: WASocket, update: BaileysEventMap["messages.delete"]) {
		this.client = client;
		this.update = update;
		this.event();
	}
	private async event() {
		if (getAntidelete()) {
			if ("keys" in this.update) {
				const keys = this.update.keys;

				for (const key of keys) {
					const msg = loadMessage(key);

					if (msg && !msg.key.fromMe) {
						const jid = String(
							isJidGroup(msg.key.remoteJid!) ? msg.key.remoteJid : this.client.user?.id
						);

						return await forwardMessage(this.client, jid, msg, { quoted: msg });
					}
				}
			}
		}
	}
}
