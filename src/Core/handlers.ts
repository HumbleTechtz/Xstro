import lang from "../Utils/lang.ts";
import { commands } from "./plugin.ts";
import { getStickerCmd, canProceed, resetIfExpired } from "../Models/index.ts";
import type { Serialize } from "./serialize.ts";

class CleanupManager {
	private static instance: CleanupManager;
	private cleanupInterval: NodeJS.Timeout | null = null;

	static getInstance(): CleanupManager {
		if (!CleanupManager.instance) {
			CleanupManager.instance = new CleanupManager();
		}
		return CleanupManager.instance;
	}

	startCleanup() {
		if (this.cleanupInterval) return;

		this.cleanupInterval = setInterval(
			async () => {
				try {
					await resetIfExpired();
				} catch (e) {
					console.error("Cleanup error:", e);
				}
			},
			5 * 60 * 1000,
		);
	}

	stopCleanup() {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
			this.cleanupInterval = null;
		}
	}
}

class CommandValidator {
	static async validate(cmd: any, message: Serialize): Promise<string | null> {
		if (message.mode && !message.sudo) return null;

		if (cmd.fromMe && !message.sudo) {
			return lang.FOR_SUDO_USERS;
		}

		if (cmd.isGroup && !message.isGroup) {
			return lang.FOR_GROUPS_ONLY;
		}

		if (!message.sudo && !(await canProceed(message.sender!))) {
			return lang.RATE_LIMIT_REACHED;
		}

		return "valid";
	}
}

class TextCommandHandler {
	static async process(message: Serialize) {
		if (!message?.text) return;

		for (const cmd of commands) {
			const handler =
				message.prefix.find((p: string) => message?.text?.startsWith(p)) ?? "";
			const match = message.text
				.slice(handler.length)
				.match(cmd.name as string | RegExp);

			if (!handler || !match) continue;

			const validation = await CommandValidator.validate(cmd, message);
			if (!validation) continue;

			if (validation !== "valid") {
				await message.send(validation);
				continue;
			}

			await message.react("⏳");
			await this.executeCommand(cmd, message, match[2] ?? "");
		}
	}

	private static async executeCommand(
		cmd: any,
		message: Serialize,
		args: string,
	) {
		try {
			await cmd.function(message, args);
		} catch (e) {
			const cmdName =
				cmd.name?.toString().toLowerCase().split(/\W+/)[2] || "unknown";
			await message.send(
				`\`\`\`An error occurred while running ${cmdName} command\`\`\``,
			);
			console.error(`Command execution error (${cmdName}):`, e);
		}
	}
}

class StickerCommandHandler {
	static async process(message: Serialize) {
		const sticker = await this.extractStickerCommand(message);
		if (!sticker) return;

		for (const cmd of commands) {
			const match = sticker.cmdname.match(cmd.name! as string | RegExp);
			if (!match) continue;

			const validation = await CommandValidator.validate(cmd, message);

			if (!validation || validation === "valid") {
				if (validation === "valid") {
					await cmd.function(message, match[2] ?? "");
				} else if (validation) {
					await message.send(validation);
				}
			}
		}
	}

	private static async extractStickerCommand(message: Serialize) {
		const stickerMessage = message?.message?.stickerMessage;
		const lottieStickerMessage = message?.message?.lottieStickerMessage;

		const fileSha256 =
			stickerMessage?.fileSha256 ??
			lottieStickerMessage?.message?.stickerMessage?.fileSha256;

		if (!fileSha256) return null;

		const filesha256 = Buffer.from(new Uint8Array(fileSha256)).toString("base64");

		const result = await getStickerCmd(filesha256);

		return result;
	}
}

class EventListenerHandler {
	static async process(message: Serialize) {
		const eventCommands = commands.filter(cmd => cmd.on);

		await Promise.allSettled(eventCommands.map(cmd => cmd.function(message)));
	}
}

export default async function handlers(message: Serialize) {
	CleanupManager.getInstance().startCleanup();

	await Promise.allSettled([
		TextCommandHandler.process(message).catch(e =>
			console.error("Text command error:", e),
		),
		StickerCommandHandler.process(message).catch(e =>
			console.error("Sticker command error:", e),
		),
		EventListenerHandler.process(message).catch(e =>
			console.error("Event listener error:", e),
		),
	]);
}
