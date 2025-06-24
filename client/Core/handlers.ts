import lang from "../Utils/language";
import { commands } from "./plugin";
import { getStickerCmd, canProceed, resetIfExpired } from "../Models";
import type { Serialize } from "./serialize";

let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
	if (cleanupTimer) return;
	cleanupTimer = setInterval(
		() => resetIfExpired().catch(console.error),
		300000
	);
}

async function validateCommand(
	cmd: any,
	message: Serialize
): Promise<string | null> {
	if (message.mode && !message.sudo) return null;
	if (cmd.fromMe && !message.sudo) return lang.FOR_SUDO_USERS;
	if (cmd.isGroup && !message.isGroup) return lang.FOR_GROUPS_ONLY;
	if (!message.sudo && !(await canProceed(message.sender)))
		return lang.RATE_LIMIT_REACHED;
	return "valid";
}

async function processTextCommands(message: Serialize) {
	if (!message?.text) return;

	for (const cmd of commands) {
		const prefix = message.prefix.find((p: string) =>
			message.text?.startsWith(p)
		);
		if (!prefix) continue;

		const match = message.text
			.slice(prefix.length)
			.match(cmd.name as string | RegExp);
		if (!match) continue;

		const validation = await validateCommand(cmd, message);
		if (!validation) continue;

		if (validation !== "valid") {
			await message.send(validation);
			continue;
		}

		await message.react("⏳");
		try {
			await cmd.function(message, match[2] ?? "");
		} catch (e) {
			const cmdName =
				cmd.name?.toString().toLowerCase().split(/\W+/)[2] || "unknown";
			await message.send(`_Unable to run command correctly._`);
			console.error(`Command execution error (${cmdName}):`, e);
		}
	}
}

async function processStickerCommands(message: Serialize) {
	const stickerMessage = message?.message?.stickerMessage;
	const lottieStickerMessage = message?.message?.lottieStickerMessage;

	const fileSha256 =
		stickerMessage?.fileSha256 ??
		lottieStickerMessage?.message?.stickerMessage?.fileSha256;

	if (!fileSha256) return;

	const filesha256 = Buffer.from(new Uint8Array(fileSha256)).toString("base64");
	const sticker = await getStickerCmd(filesha256);
	if (!sticker) return;

	for (const cmd of commands) {
		const match = sticker.cmdname!.match(cmd.name! as string | RegExp);
		if (!match) continue;

		const validation = await validateCommand(cmd, message);
		if (validation === "valid") {
			await cmd.function(message, match[2] ?? "");
		} else if (validation) {
			await message.send(validation);
		}
	}
}

async function processEventListeners(message: Serialize) {
	const eventCommands = commands.filter(cmd => cmd.on);
	await Promise.allSettled(eventCommands.map(cmd => cmd.function(message)));
}

export default async function handlers(message: Serialize) {
	startCleanup();

	await Promise.allSettled(
		[
			processTextCommands(message),
			processStickerCommands(message),
			processEventListeners(message),
		].map(err => err.catch(console.error))
	);
}
