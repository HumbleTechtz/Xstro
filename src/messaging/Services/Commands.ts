import Message from '../Messages/Message.ts';
import lang from '../../utils/lang.ts';
import { print } from '../../utils/index.ts';
import { commands } from '../plugins.ts';
import { getStickerCmd } from '../../models/sticker.ts';
import type { Commands } from '../../types/bot.ts';
import {
	canProceed,
	getRemainingQuota,
	resetIfExpired,
} from '../../models/ratelimter.ts';

export default class RunCommand {
	private message: Message;
	private sudo: boolean;
	private sender: string | null | undefined;
	private text: string | null | undefined;
	private prefix: string[];

	constructor(message: Message) {
		this.message = message;
		this.sudo = message.sudo;
		this.sender = message.sender;
		this.text = message.data.text;
		this.prefix = message.data.prefix;
		this.init();
		setInterval(
			async () => {
				try {
					await resetIfExpired();
				} catch (e) {
					console.error('Rate limiter reset error:', e);
				}
			},
			5 * 60 * 1000,
		);
	}

	private async init() {
		await this.run();
		await this.runSticker();
		await this.runOnlistener();
	}

	private async run() {
		if (!this.text) return;
		for (const cmd of commands) {
			const handler =
				this.prefix.find((p: string) => this.text?.startsWith(p)) ?? '';
			const match = this.text
				.slice(handler?.length || 0)
				.match(cmd.name as string);

			if (!handler || !match) continue;
			if (!this.checkBeforeCommandExecution(cmd)) continue;

			try {
				if (!this.sudo) {
					if (!(await canProceed(this.sender!)))
						return await this.message.send(
							`_⛔ You have reached your daily limit. Try again tomorrow._`,
						);
				}
				await this.message.react('⏳');
				await cmd.function(this.message, match[2] ?? '');
			} catch (err) {
				print.fail(JSON.stringify(err));
			}
		}
	}

	private async runSticker() {
		const stickerMessage = this.message.data.message?.stickerMessage;
		const lottieStickerMessage =
			this.message.data.message?.lottieStickerMessage;

		const fileSha256 =
			stickerMessage?.fileSha256 ??
			lottieStickerMessage?.message?.stickerMessage?.fileSha256;

		const filesha256 = fileSha256
			? Buffer.from(new Uint8Array(fileSha256)).toString('base64')
			: undefined;

		const sticker = await getStickerCmd(filesha256 ?? '');

		if (sticker) {
			for (const cmd of commands) {
				const match = sticker.cmdname.match(cmd.name as string);

				if (!match) continue;
				if (!this.checkBeforeCommandExecution(cmd)) continue;

				try {
					await cmd.function(this.message, match[2] ?? '');
				} catch (err) {
					print.fail(JSON.stringify(err));
				}
			}
		}
	}

	private async runOnlistener() {
		for (const cmd of commands.filter(cmd => cmd.on)) {
			try {
				await cmd.function(this.message);
			} catch (error) {
				print.fail(JSON.stringify(error));
			}
		}
	}

	private checkBeforeCommandExecution(cmd: Commands) {
		if (this.message.mode && !this.message.sudo) return false;
		if (cmd.fromMe && !this.message.sudo) {
			this.message.send(lang.FOR_SUDO_USERS);
			return false;
		}
		if (cmd.isGroup && !this.message.isGroup) {
			this.message.send(lang.FOR_GROUPS_ONLY);
			return false;
		}
		return true;
	}
}
