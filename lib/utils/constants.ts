import type { WAMessageContent } from "baileys";

export function extractTxt(
	message?: WAMessageContent
): string | undefined | null {
	if (!message) return null;
	//@ts-ignore
	const get = (obj, path) => path.split(".").reduce((o, p) => o?.[p], obj);
	//@ts-ignore
	const poll = p => p?.name + "\n" + p?.options?.map(o => o.optionName);

	return (
		get(message, "conversation") ||
		get(message, "documentMessage.caption") ||
		get(message, "videoMessage.caption") ||
		get(message, "extendedTextMessage.text") ||
		(message.eventMessage &&
			(message.eventMessage.name || "") +
				"\n" +
				(message.eventMessage.description || "")) ||
		(message.pollCreationMessageV3 && poll(message.pollCreationMessageV3)) ||
		(message.pollCreationMessage && poll(message.pollCreationMessage)) ||
		(message.pollCreationMessageV2 && poll(message.pollCreationMessageV2)) ||
		get(message, "protocolMessage.editedMessage.extendedTextMessage.text") ||
		get(message, "protocolMessage.editedMessage.videoMessage.caption") ||
		get(message, "protocolMessage.editedMessage.imageMessage.caption") ||
		get(message, "protocolMessage.editedMessage.conversation") ||
		get(message, "protocolMessage.editedMessage.documentMessage.caption")
	);
}
