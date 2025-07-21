import { getContentType } from "baileys";
import { getQuote } from "..";
import type { WAMessage, WAMessageContent } from "baileys";

export const restart = () => process.exit(1);

export const shutdown = () => process.exit();

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

export function isUrl(str: string): boolean {
	// Quick checks to eliminate non-URLs faster
	if (str.length > 2048) return false; // URLs are typically shorter
	if (str.includes("\n") || str.includes(" ")) return false; // URLs don't contain spaces or newlines

	// Check for URL-like patterns quickly
	const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	return urlPattern.test(str);
}

export const formatRuntime = (uptime: number): string => {
	const hours = Math.floor(uptime / 3600);
	const minutes = Math.floor((uptime % 3600) / 60);
	const seconds = Math.floor(uptime % 60);
	return `${hours}h ${minutes}m ${seconds}s`;
};

export function getBio(): string {
	const now = new Date();
	const date = now.toLocaleDateString("en-PK");
	const time = now.toLocaleTimeString("en-PK");
	const quote = getQuote();
	return `${quote} | 📅 ${date} | 🕒 ${time} | ⚡ Powered Xstro`;
}

export function fancy(text: any): string {
	const fancyMap: Record<string, string> = {
		a: "ᴀ",
		b: "ʙ",
		c: "ᴄ",
		d: "ᴅ",
		e: "ᴇ",
		f: "ғ",
		g: "ɢ",
		h: "ʜ",
		i: "ɪ",
		j: "ᴊ",
		k: "ᴋ",
		l: "ʟ",
		m: "ᴍ",
		n: "ɴ",
		o: "ᴏ",
		p: "ᴘ",
		q: "ǫ",
		r: "ʀ",
		s: "s",
		t: "ᴛ",
		u: "ᴜ",
		v: "ᴠ",
		w: "ᴡ",
		x: "x",
		y: "ʏ",
		z: "ᴢ",

		"0": "𝟬",
		"1": "𝟭",
		"2": "𝟮",
		"3": "𝟯",
		"4": "𝟰",
		"5": "𝟱",
		"6": "𝟲",
		"7": "𝟳",
		"8": "𝟴",
		"9": "𝟵",
	};

	return String(text)
		.toLowerCase()
		.split("")
		.map(char => fancyMap[char] || char)
		.join("");
}
