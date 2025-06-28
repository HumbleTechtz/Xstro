import { cachedGroupMetadata } from "../Models";
import { Serialize } from "../Core/serialize";
import { Boom } from "@hapi/boom";
import { WAMessageContent } from "baileys";

export const restart = () => process.exit(0);
export const shutdown = () => process.exit(1);

export async function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function isUrl(text: string): boolean {
	if (typeof text !== "string" || !text.trim()) return false;
	try {
		const url = new URL(text.trim());
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		const urlRegex =
			/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
		return urlRegex.test(text.trim());
	}
}

export function urlContent(url: string) {
	return new Promise<{ buffer: Buffer; mimeType: string }>(
		async (resolve, reject) => {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					return reject(
						new Boom("Failed to fetch URL content", {
							statusCode: response.status,
						})
					);
				}
				const buffer = Buffer.from(await response.arrayBuffer());
				const mimeType =
					response.headers.get("content-type") || "application/octet-stream";
				resolve({ buffer, mimeType });
			} catch (err) {
				reject(err);
			}
		}
	);
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
	return (dDisplay + hDisplay + mDisplay + sDisplay).trim();
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
	return String(text)
		.toLowerCase()
		.split("")
		.map(char => fancyMap[char] || char)
		.join("");
}

export function isAdmin(jid: string, participant: string): boolean {
	const metadata = cachedGroupMetadata(jid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	return allAdmins.includes(participant);
}

export function isBotAdmin(
	owner: { jid: string; lid: string },
	jid: string
): boolean {
	const metadata = cachedGroupMetadata(jid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	const isAdmin =
		metadata.addressingMode === "lid"
			? allAdmins.includes(owner.lid)
			: allAdmins.includes(owner.jid);
	return isAdmin;
}

export function isValidTimeString(timeStr: string): boolean {
	const match = timeStr
		.trim()
		.toLowerCase()
		.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
	if (!match) return false;
	const [_, hours, minutes, period] = match;
	const h = parseInt(hours, 10);
	const m = parseInt(minutes, 10);
	return (
		h >= 1 && h <= 12 && m >= 0 && m <= 59 && (period === "am" || period === "pm")
	);
}

export function getCurrentTimeString(): string {
	const now = new Date();
	let hours = now.getHours();
	const minutes = now.getMinutes();
	const period = hours >= 12 ? "pm" : "am";
	hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
	return `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
}

export function startClockAlignedScheduler(callback: () => void): void {
	const now = new Date();
	const msUntilNextMinute =
		(60 - now.getSeconds()) * 1000 - now.getMilliseconds();
	setTimeout(() => {
		callback();
		setInterval(callback, 60 * 1000);
	}, msUntilNextMinute);
}

export function extractUrl(text?: string): string | null {
	if (typeof text !== "string") return null;
	const urlRegex =
		/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
	const matches = text.match(urlRegex);
	return matches?.[0] || null;
}

export function countdown(
	secs: number,
	client: Serialize,
	customMessage?: string
): void {
	const interval = setInterval(() => {
		secs -= 10;
		if (secs > 0) {
			client.send(`_${secs} ${customMessage ?? "seconds left"}_`);
		} else {
			client.send(`_0 ${customMessage ?? "seconds left"}_`);
			clearInterval(interval);
		}
	}, 10000);
}

export function text_from_message(
	message?: WAMessageContent
): string | null | undefined {
	if (!message) return null;

	const getText = (obj: any, path: string) =>
		path.split(".").reduce((o, p) => o?.[p], obj);
	const pollText = (poll: any) =>
		`${poll?.name}\n${poll?.options?.map((o: any) => o.optionName)}`;

	return (
		getText(message, "conversation") ||
		getText(message, "documentMessage.caption") ||
		getText(message, "videoMessage.caption") ||
		getText(message, "extendedTextMessage.text") ||
		(message.eventMessage &&
			`${message.eventMessage.name || ""}\n${
				message.eventMessage.description || ""
			}`) ||
		(message.pollCreationMessageV3 && pollText(message.pollCreationMessageV3)) ||
		(message.pollCreationMessage && pollText(message.pollCreationMessage)) ||
		(message.pollCreationMessageV2 && pollText(message.pollCreationMessageV2)) ||
		getText(message, "protocolMessage.editedMessage.extendedTextMessage.text") ||
		getText(message, "protocolMessage.editedMessage.videoMessage.caption") ||
		getText(message, "protocolMessage.editedMessage.imageMessage.caption") ||
		getText(message, "protocolMessage.editedMessage.conversation") ||
		getText(message, "protocolMessage.editedMessage.documentMessage.caption")
	);
}
