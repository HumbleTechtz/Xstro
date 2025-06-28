import lang from "../Utils/language";
import { commands } from "./plugin";
import { getStickerCmd, canProceed, resetIfExpired } from "../Models";
import type { Serialize } from "./serialize";

let cleanupTimer: NodeJS.Timeout | null = null;

const startCleanup = () =>
	(cleanupTimer ??= setInterval(resetIfExpired, 300000));

const verify = (cmd: any, message: Serialize) => {
	if (message.mode && !message.sudo) return null;
	if (cmd.fromMe && !message.sudo) return lang.FOR_SUDO_USERS;
	if (cmd.isGroup && !message.isGroup) return lang.FOR_GROUPS_ONLY;
	if (!message.sudo && !canProceed(message.sender))
		return lang.RATE_LIMIT_REACHED;
	return "valid";
};

async function executeCommand(cmd: any, message: Serialize, args?: string) {
	try {
		const result = verify(cmd, message);
		if (result === "valid") {
			await Promise.resolve(cmd.function(message, args)).catch(async err => {
				console.error(err);
			});
		} else if (result) {
			await Promise.resolve(message.send(result)).catch(console.error);
		}
	} catch (e) {
		console.error(e);
		try {
		} catch (e) {
			console.error(e);
		}
	}
}

const text = async (message: Serialize) => {
	if (!message?.text) return;

	for (const cmd of commands) {
		const prefix = message.prefix.find((p: string) =>
			message.text?.startsWith(p)
		);
		if (!prefix) continue;

		const match = message.text.slice(prefix.length).match(cmd.name!);
		if (match) executeCommand(cmd, message, match[2]);
	}
};

const sticker = (message: Serialize) => {
	const fileSha256 =
		message?.message?.stickerMessage?.fileSha256 ??
		message?.message?.lottieStickerMessage?.message?.stickerMessage?.fileSha256;

	if (!fileSha256) return;

	const filesha256 = Buffer.from(new Uint8Array(fileSha256)).toString("base64");
	const stickerCmd = getStickerCmd(filesha256);
	if (!stickerCmd) return;

	for (const cmd of commands) {
		const match = stickerCmd.cmdname?.match(cmd.name!);
		if (match) executeCommand(cmd, message, match[2]);
	}
};

const ev = async (message: Serialize) => {
	for (const cmd of commands)
		if (cmd.on) await Promise.resolve(cmd.function(message)).catch(console.error);
};

export default async function (message: Serialize) {
	startCleanup();
	await Promise.allSettled([text, sticker, ev].map(fn => fn(message)));
}
