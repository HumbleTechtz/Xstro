import lang from "../Utils/lang.ts";
import { commands } from "./plugin.ts";
import { getStickerCmd, canProceed, resetIfExpired } from "../Models/index.ts";
import type { Serialize } from "./serialize.ts";

export default async function (message: Serialize) {
	setInterval(
		async () => {
			try {
				await resetIfExpired();
			} catch (e) {
				console.error(e);
			}
		},
		5 * 60 * 1000,
	);

	await Promise.all([
		(async () => {
			try {
				if (!message?.text) return;
				for (const cmd of commands) {
					const handler =
						message.prefix.find((p: string) => message?.text?.startsWith(p)) ?? "";
					const match = message.text
						.slice(handler.length)
						.match(cmd.name as string | RegExp);

					if (!handler || !match) continue;

					if (message.mode && !message.sudo) continue;

					if (cmd.fromMe && !message.sudo) {
						await message.send(lang.FOR_SUDO_USERS);
						continue;
					}

					if (cmd.isGroup && !message.isGroup) {
						await message.send(lang.FOR_GROUPS_ONLY);
						continue;
					}

					if (!message.sudo && !(await canProceed(message.sender!))) {
						await message.send(lang.RATE_LIMIT_REACHED);
						continue;
					}

					await message.react("⏳");

					try {
						await cmd.function(message, match[2] ?? "");
					} catch (e) {
						await message.send(
							`\`\`\`An error occured while running ${cmd.name?.toString().toLowerCase().split(/\W+/)[2]} command\`\`\``,
						);
						console.error(e);
					}
				}
			} catch (e) {
				console.error("Command Error: " + (e as Error).stack);
			}
		})(),

		(async () => {
			try {
				const stickerMessage = message?.message?.stickerMessage;
				const lottieStickerMessage = message?.message?.lottieStickerMessage;
				const fileSha256 =
					stickerMessage?.fileSha256 ??
					lottieStickerMessage?.message?.stickerMessage?.fileSha256;

				const filesha256 = fileSha256
					? Buffer.from(new Uint8Array(fileSha256)).toString("base64")
					: undefined;

				const sticker = await getStickerCmd(filesha256 ?? "");
				if (!sticker) return;

				for (const cmd of commands) {
					const match = sticker.cmdname.match(cmd.name! as string | RegExp);
					if (!match) continue;

					if (message.mode && !message.sudo) continue;

					if (cmd.fromMe && !message.sudo) {
						await message.send(lang.FOR_SUDO_USERS);
						continue;
					}

					if (cmd.isGroup && !message.isGroup) {
						await message.send(lang.FOR_GROUPS_ONLY);
						continue;
					}

					await cmd.function(message, match[2] ?? "");
				}
			} catch (err) {
				console.error("Sticker command error: " + (err as Error).stack);
			}
		})(),

		(async () => {
			try {
				for (const cmd of commands.filter(cmd => cmd.on)) {
					await cmd.function(message);
				}
			} catch (err) {
				console.error("On-listener error: " + (err as Error).stack);
			}
		})(),
	]);
}
