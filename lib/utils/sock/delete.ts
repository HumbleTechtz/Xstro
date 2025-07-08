import { isJidGroup, jidNormalizedUser, WAMessage, WASocket } from "baileys";
import { isMediaMessage } from "../constants";
import { isBotAdmin } from "../admin";

export async function deleteM(sock: WASocket, msg: WAMessage) {
	const canDeleteForAll =
		isJidGroup(msg.key.remoteJid!) &&
		(await isBotAdmin(
			{
				jid: jidNormalizedUser(sock.user?.jid),
				lid: jidNormalizedUser(sock.user?.lid),
			},
			msg.key.remoteJid!
		))
			? true
			: false;
	if (!canDeleteForAll) {
		return await sock.chatModify(
			{
				deleteForMe: {
					deleteMedia: isMediaMessage(msg),
					key: msg?.key,
					timestamp: Date.now(),
				},
			},
			msg.key.remoteJid!
		);
	}
	return await sock.sendMessage(msg.key.remoteJid!, {
		delete: msg?.key,
	});
}
