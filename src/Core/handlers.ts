import lang from "../Utils/lang.ts";
import { commands } from "./plugin.ts";
import { getStickerCmd, canProceed, resetIfExpired } from "../Models/index.ts";
import type { Serialize } from "./serialize.ts";

export default async function (message: Serialize) {
	const { sudo, sender, prefix, text, mode, isGroup, send } = message;

	setInterval(
		async () => {
			try {
				await resetIfExpired();
			} catch (e) {
				console.error(e);
			}
		},
		5 * 60 * 1000
	);

	await Promise.all([
		(async () => {
			try {
				if (!text) return;
				for (const cmd of commands) {
					const handler = prefix.find((p: string) => text.startsWith(p)) ?? "";
					const match = text
						.slice(handler.length)
						.match(cmd.name as string | RegExp);

					if (!handler || !match) continue;

					if (mode && !sudo) continue;

					if (cmd.fromMe && !sudo) {
						await message.send(lang.FOR_SUDO_USERS);
						continue;
					}

					if (cmd.isGroup && !isGroup) {
						await send(lang.FOR_GROUPS_ONLY);
						continue;
					}

					if (!sudo && !(await canProceed(sender!))) {
						await message.send(lang.RATE_LIMIT_REACHED);
						continue;
					}

					await message.react("⏳");

					try {
						await cmd.function(message, match[2] ?? "");
					} catch (e) {
						await message.send(
							`\`\`\`An error occured while running ${cmd.name?.toString().toLowerCase().split(/\W+/)[2]} command\`\`\``
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

					if (mode && !sudo) continue;

					if (cmd.fromMe && !sudo) {
						await send(lang.FOR_SUDO_USERS);
						continue;
					}

					if (cmd.isGroup && !isGroup) {
						await send(lang.FOR_GROUPS_ONLY);
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
