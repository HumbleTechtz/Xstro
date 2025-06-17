import { cachedGroupMetadata } from "../Models/index.ts";
import {
	isJidUser,
	isLidUser,
	type GroupMetadata,
	type WAMessageContent,
	type WASocket,
} from "baileys";
import type { OnWhatsAppResult } from "../Types/OnWhatsApp.ts";

export const restart = () => process.exit(0);
export const shutdown = () => process.exit(1);

export function isPath(text: string): boolean {
	if (typeof text !== "string" || text.trim() === "") return false;

	return /^(?:\.|\.\.|[a-zA-Z]:)?[\/\\]?[a-zA-Z0-9_\-.]+(?:[\/\\][a-zA-Z0-9_\-.]+)*(?:\.[a-zA-Z0-9]+)?$/.test(
		text.trim()
	);
}

export function isText(text: string): boolean {
	if (typeof text !== "string" || text.trim() === "") return false;

	const trimmedText = text.trim();
	const bufferPattern =
		/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)$/;
	const hexPattern = /^(?:0x)?[0-9a-fA-F]+$/;

	return !bufferPattern.test(trimmedText) && !hexPattern.test(trimmedText);
}

export function formatDate(timestamp: number | Date): string {
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

export function formatRuntime(seconds: number): string {
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	const dDisplay = d > 0 ? `${d} d ` : "";
	const hDisplay = h > 0 ? `${h} h ` : "";
	const mDisplay = m > 0 ? `${m} m ` : "";
	const sDisplay = s > 0 ? `${s} s` : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return "0B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))}${sizes[i]}`;
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
	};

	text = String(text).toLowerCase();

	return text
		.split("")
		.map((char: string) => fancyMap[char] || char)
		.join("");
}

export async function isAdmin(jid: string, participant: string) {
	const metadata = await cachedGroupMetadata(jid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	return allAdmins.includes(participant);
}

export async function isBotAdmin(
	owner: { jid: string; lid: string },
	jid: string
) {
	const metadata = await cachedGroupMetadata(jid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	if (metadata.addressingMode === "lid") return allAdmins.includes(owner.lid);
	return allAdmins.includes(owner.jid);
}

export function isValidTimeString(timeStr: string): boolean {
	const match = timeStr
		.trim()
		.toLowerCase()
		.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
	if (!match) return false;

	// eslint-disable-next-line
	const [_, hours, minutes, period] = match;
	const h = parseInt(hours, 10);
	const m = parseInt(minutes, 10);

	return (
		h >= 1 &&
		h <= 12 &&
		m >= 0 &&
		m <= 59 &&
		(period === "am" || period === "pm")
	);
}

export function getCurrentTimeString(): string {
	const now = new Date();
	let hours = now.getHours();
	const minutes = now.getMinutes();
	const period = hours >= 12 ? "pm" : "am";

	if (hours === 0) hours = 12;
	else if (hours > 12) hours -= 12;

	return `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
}

/**
 * Runs the provided callback exactly at the start of every minute
 */
export function startClockAlignedScheduler(callback: () => void) {
	const now = new Date();
	const msUntilNextMinute =
		(60 - now.getSeconds()) * 1000 - now.getMilliseconds();

	// Wait until the next minute hits
	setTimeout(() => {
		callback(); // Run immediately at start of minute
		setInterval(callback, 60 * 1000); // Then run every full minute
	}, msUntilNextMinute);
}

export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}
/**
 * Extracts the first valid URL from a string, or returns null if none found.
 */
export function extractUrl(text: string): string | null {
	if (typeof text !== "string") return null;
	const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
	const matches = text.match(urlRegex);
	return matches && matches.length > 0 ? matches[0] : null;
}

export function extractStringfromMessage(message?: WAMessageContent) {
	if (!message) return undefined;
	if (message?.conversation) return message.conversation;
	if (message?.documentMessage?.caption) return message.documentMessage.caption;
	if (message?.videoMessage?.caption) return message.videoMessage.caption;
	if (message?.extendedTextMessage) return message.extendedTextMessage.text;
	if (message?.eventMessage) {
		return `${message?.eventMessage?.name ?? ""}\n${
			message?.eventMessage?.description ?? ""
		}`;
	}
	if (message?.pollCreationMessageV3) {
		return `${
			message?.pollCreationMessageV3?.name
		}\n${message?.pollCreationMessageV3?.options
			?.map(opt => opt.optionName)
			.toString()}`;
	}
	if (message?.pollCreationMessage) {
		return `${
			message?.pollCreationMessage?.name
		}\n${message?.pollCreationMessage?.options
			?.map(opt => opt.optionName)
			.toString()}`;
	}
	if (message?.pollCreationMessageV2) {
		return `${
			message?.pollCreationMessageV2?.name
		}\n${message?.pollCreationMessageV2?.options
			?.map(opt => opt.optionName)
			.toString()}`;
	}
	if (message?.protocolMessage) {
		if (message?.protocolMessage?.editedMessage?.extendedTextMessage) {
			return message?.protocolMessage?.editedMessage?.extendedTextMessage?.text;
		}
		if (message?.protocolMessage?.editedMessage?.videoMessage) {
			return message?.protocolMessage?.editedMessage?.videoMessage?.caption;
		}
		if (message?.protocolMessage?.editedMessage?.imageMessage) {
			return message?.protocolMessage?.editedMessage?.imageMessage?.caption;
		}
		if (message?.protocolMessage?.editedMessage?.conversation) {
			return message?.protocolMessage?.editedMessage?.conversation;
		}
		if (message?.protocolMessage?.editedMessage?.documentMessage) {
			return message?.protocolMessage?.editedMessage?.documentMessage?.caption;
		}
	}
}

export async function findJidLid(
	client: WASocket,
	data: GroupMetadata["participants"],
	input: string,
	addressMode: "lid" | "pn"
) {
	if (input?.startsWith("@")) input = input.split("@")[1];
	if (input?.includes("@")) input = input.split("@")[0];
	if (addressMode === "lid") {
		for (const entry of data) {
			const idNumber = entry.id?.split("@")[0];
			const jidNumber = entry.jid?.split("@")[0];
			if (idNumber === input || jidNumber === input) {
				return { jid: entry.jid, lid: entry.id };
			}
		}
		return null;
	}

	const jids = [input];
	const waResults = (await client.onWhatsApp(...jids)) as OnWhatsAppResult[];

	if (waResults.length === 0) {
		return null;
	}

	const result = waResults[0];
	return addressMode === "pn" ? result.jid : result.lid;
}

export async function parseUserId(id: any, client: WASocket) {
	if (!id) return undefined;
	if (isLidUser(id) || isJidUser(id)) return id;

	const num = id.replace(/\D+/g, "");
	const jid = `${num}@s.whatsapp.net`;

	try {
		const data = await client.onWhatsApp(jid);
		if (data?.[0]?.exists) return data[0].jid;
	} catch {
		return `${num}@lid`;
	}
	return undefined;
}
