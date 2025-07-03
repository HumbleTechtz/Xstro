import { getDataType, isUrl, urlContent } from "../common";
import {
	getContentType,
	type AnyMessageContent,
	type WAContextInfo,
	type WAMessage,
	type WASocket,
} from "baileys";

export type mtype =
	| "text"
	| "audio"
	| "image"
	| "video"
	| "sticker"
	| "document";

export async function sendMessage(
	client: WASocket,
	content: string | Buffer,
	options: {
		jid: string;
		mimetype?: string;
		type?: mtype;
		quoted?: WAMessage;
	} & Partial<AnyMessageContent>
) {
	const jid = options.jid;
	const explicitType = options.type;
	let messageContent: AnyMessageContent;
	let buffer: Buffer;
	let mimeType: string | undefined;

	if (typeof content === "string") {
		if (isUrl(content)) {
			try {
				const fetched = await urlContent(content);
				buffer = fetched.buffer;
				mimeType = fetched.mimeType;
			} catch {
				messageContent = { text: content, ...options };
				return await client.sendMessage(jid, messageContent, { ...options });
			}
		} else {
			messageContent = { text: content, ...options };
			return await client.sendMessage(jid, messageContent, { ...options });
		}
	} else {
		buffer = content;
		mimeType = explicitType
			? options?.mimetype
			: (await getDataType(content)).mimeType;
	}

	const type = explicitType || (await getDataType(buffer)).contentType;

	if (type === "text") {
		messageContent = { text: buffer.toString(), ...options };
	} else if (type === "image") {
		messageContent = {
			image: typeof content === "string" ? { url: content } : buffer,
			...options,
		};
	} else if (type === "audio") {
		messageContent = {
			audio: typeof content === "string" ? { url: content } : buffer,
			...options,
		};
	} else if (type === "video") {
		messageContent = {
			video: typeof content === "string" ? { url: content } : buffer,
			...options,
		};
	} else if (type === "sticker") {
		messageContent = {
			sticker: typeof content === "string" ? { url: content } : buffer,
			...options,
		};
	} else if (type === "document") {
		messageContent = {
			document: typeof content === "string" ? { url: content } : buffer,
			mimetype: mimeType || "application/octet-stream",
			...options,
		};
	} else {
		console.error(`Unsupported content type: ${type}`);
		throw new Error(`Unsupported content type: ${type}`);
	}

	return await client.sendMessage(jid, messageContent, { ...options });
}

export async function forwardMessage(
	client: WASocket,
	jid: string,
	message: WAMessage,
	options?: WAContextInfo & { quoted: WAMessage }
) {
	return await client.sendMessage(
		jid,
		{
			forward: message,
			contextInfo: { ...options },
		},
		{ quoted: options?.quoted }
	);
}

export const isMediaMessage = (message: WAMessage): boolean => {
	const mediaMessageTypes = [
		"imageMessage",
		"videoMessage",
		"audioMessage",
		"documentMessage",
	] as const;
	const content = getContentType(message?.message ?? {});
	return (
		typeof content === "string" &&
		mediaMessageTypes.includes(content as (typeof mediaMessageTypes)[number])
	);
};
