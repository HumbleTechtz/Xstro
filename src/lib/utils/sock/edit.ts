import { isMediaMessage } from "../constants.ts";
import { getContentType } from "baileys";
import type { WASocket, WAMessage } from "baileys";

export async function edit(sock: WASocket, text: string, msg: WAMessage) {
	if (isMediaMessage(msg)) {
		return (await sock.sendMessage(
			msg.key.remoteJid!,
			getContentType(msg.message!) === "imageMessage"
				? {
						image: { url: msg.message?.imageMessage?.url! },
						caption: text,
						edit: msg.key,
				  }
				: {
						video: { url: msg.message?.videoMessage?.url! },
						caption: text,
						edit: msg.key,
				  }
		)) as WAMessage;
	}
	return (await sock.sendMessage(msg.key.remoteJid!, {
		text,
		edit: msg.key,
	})) as WAMessage;
}
