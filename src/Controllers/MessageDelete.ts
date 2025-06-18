/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Controller for handling message deletion events in WhatsApp bot using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import { isJidGroup } from "baileys";
import { getAntidelete, loadMessage } from "../Models/index.ts";
import {
	isMediaMessage,
	forwardM,
	extractStringfromMessage,
} from "../Utils/index.ts";
import type { BaileysEventMap, WASocket } from "baileys";

export default class MessageDelete {
	protected client: WASocket;
	protected update: BaileysEventMap["messages.delete"];
	constructor(client: WASocket, update: BaileysEventMap["messages.delete"]) {
		this.client = client;
		this.update = update;
		this.event();
	}
	private async event() {
		const shouldDelete = await getAntidelete();
		if (!shouldDelete) return;

		if ("keys" in this.update) {
			const keys = this.update.keys;

			for (const key of keys) {
				const store = await loadMessage(key);

				if (store && !store.key.fromMe) {
					const remoteJid = store.key.remoteJid;
					const userId = this.client.user?.id;
					const jid = isJidGroup(remoteJid!) ? remoteJid : userId;

					if (isMediaMessage(store)) {
						return await forwardM(this.client, jid!, store, { quoted: store });
					}

					return await this.client.sendMessage(
						jid!,
						{
							text:
								"*ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ғᴏᴜɴᴅ ᴀ ᴍᴇssᴀɢᴇ!*\nᴍᴇssᴀɢᴇ: " +
								(extractStringfromMessage(store.message!) ?? ""),
						},
						{ quoted: store ?? undefined }
					);
				}
			}
		}
	}
}
