import { jidNormalizedUser, type WASocket } from 'baileys';
import { cachedGroupMetadata } from '../models/group.ts';
import Message from '../messaging/Messages/Message.ts';

export function isPath(text: string): boolean {
	if (typeof text !== 'string' || text.trim() === '') return false;

	return /^(?:\.|\.\.|[a-zA-Z]:)?[\/\\]?[a-zA-Z0-9_\-.]+(?:[\/\\][a-zA-Z0-9_\-.]+)*(?:\.[a-zA-Z0-9]+)?$/.test(
		text.trim(),
	);
}

export function isText(text: string): boolean {
	if (typeof text !== 'string' || text.trim() === '') return false;

	const trimmedText = text.trim();
	const bufferPattern =
		/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)$/;
	const hexPattern = /^(?:0x)?[0-9a-fA-F]+$/;

	return !bufferPattern.test(trimmedText) && !hexPattern.test(trimmedText);
}

export function formatDate(timestamp: number | Date): string {
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

export function formatRuntime(seconds: number): string {
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	const dDisplay = d > 0 ? `${d} d ` : '';
	const hDisplay = h > 0 ? `${h} h ` : '';
	const mDisplay = m > 0 ? `${m} m ` : '';
	const sDisplay = s > 0 ? `${s} s` : '';
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))}${sizes[i]}`;
}

export function isLid(id?: string) {
	if (!id) return undefined;
	if (id.toLowerCase().trim().endsWith('@lid')) {
		return true;
	}
	return undefined;
}

/**
 * Purpose of this function is to simply remove the "@" at the end of the jid/lid string
 */
export function cleanJidLid(input: string): string {
	if (!input) return '';
	return input.split('@')[0];
}

export function parseBoolean(stringStatement: string): boolean {
	stringStatement = stringStatement.toLowerCase().trim();
	if (stringStatement === 'false') {
		return false;
	}
	return true;
}

export function toStandardCase(text: string): string {
	if (!text) return '';
	text = text.trim();
	return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

export function fancy(text: any): string {
	const fancyMap: Record<string, string> = {
		a: 'ᴀ',
		b: 'ʙ',
		c: 'ᴄ',
		d: 'ᴅ',
		e: 'ᴇ',
		f: 'ғ',
		g: 'ɢ',
		h: 'ʜ',
		i: 'ɪ',
		j: 'ᴊ',
		k: 'ᴋ',
		l: 'ʟ',
		m: 'ᴍ',
		n: 'ɴ',
		o: 'ᴏ',
		p: 'ᴘ',
		q: 'ǫ',
		r: 'ʀ',
		s: 's',
		t: 'ᴛ',
		u: 'ᴜ',
		v: 'ᴠ',
		w: 'ᴡ',
		x: 'x',
		y: 'ʏ',
		z: 'ᴢ',
	};

	text = String(text).toLowerCase();

	return text
		.split('')
		.map((char: string) => fancyMap[char] || char)
		.join('');
}

export async function isAdmin(jid: string, participant: string) {
	const metadata = await cachedGroupMetadata(jid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	return allAdmins.includes(participant);
}

export async function isBotAdmin(client: WASocket, groupJid: string) {
	const jid = jidNormalizedUser(client.user?.id);
	const lid = jidNormalizedUser(client?.user?.lid);
	const metadata = await cachedGroupMetadata(groupJid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	if (metadata.addressingMode === 'lid') return allAdmins.includes(lid);
	return allAdmins.includes(jid);
}

export async function parseId(id: string, jid: string) {
	const groupInfo = await cachedGroupMetadata(jid);
	if (!groupInfo) return undefined;

	if (groupInfo.addressingMode === 'lid') {
		if (id.startsWith('@')) {
			return `${id.split('@')[1]}@lid`;
		}
		return jidNormalizedUser(id);
	} else if (groupInfo.addressingMode === 'pn') {
		if (id.startsWith('@')) {
			return `${id.split('@')[1]}@s.whatsapp.net`;
		}
		if (!id.endsWith('@s.whatsapp.net')) {
			return `${id}@s.whatsapp.net`;
		}
		return id;
	}
	return;
}

export const adminCheck = (message: Message): Promise<boolean> => {
	return new Promise(async resolve => {
		const { jid, client, sender } = message;
		if (!(await isAdmin(jid, sender))) {
			await message.send(`_@${sender?.split('@')[0]} You are not Admin_`, {
				mentions: [sender],
			});
			return resolve(false);
		}
		if (!(await isBotAdmin(client as any, jid))) {
			await message.send(`_@${sender.split('@')[0]} I am not an Admin_`, {
				mentions: [sender],
			});
		}
		resolve(true);
	});
};

export /**
 * Converts 12-hour time (e.g., "5:30pm") to a timestamp (ms since epoch) for today.
 */
function timeStringToTimestamp(timeStr: string): number | null {
	const match = timeStr
		.trim()
		.toLowerCase()
		.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
	if (!match) return null;

	let [_, hours, minutes, period] = match;
	let h = parseInt(hours, 10);
	const m = parseInt(minutes, 10);

	if (h < 1 || h > 12 || m < 0 || m > 59) return null;

	if (period === 'pm' && h !== 12) h += 12;
	if (period === 'am' && h === 12) h = 0;

	const now = new Date();
	const result = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		h,
		m,
		0,
		0,
	);
	return result.getTime();
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
		h >= 1 &&
		h <= 12 &&
		m >= 0 &&
		m <= 59 &&
		(period === 'am' || period === 'pm')
	);
}

export function getCurrentTimeString(): string {
	const now = new Date();
	let hours = now.getHours();
	const minutes = now.getMinutes();
	const period = hours >= 12 ? 'pm' : 'am';

	if (hours === 0) hours = 12;
	else if (hours > 12) hours -= 12;

	return `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
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
	if (typeof text !== 'string') return null;
	const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
	const matches = text.match(urlRegex);
	return matches && matches.length > 0 ? matches[0] : null;
}
