import { Boom } from '@hapi/boom';
import { DisconnectReason } from 'baileys';
import { commands, syncPlugins } from '../../plugin.ts';
import { getSettings, setSettings } from '../../../models/index.ts';
import { print, parseJid } from '../../../utils/index.ts';
import type { BaileysEventMap, WASocket } from 'baileys';

export default class Connection {
	private client: WASocket;
	private events: BaileysEventMap['connection.update'];
	constructor(client: WASocket, events: BaileysEventMap['connection.update']) {
		this.client = client;
		this.events = events;
		this.handleConnectionUpdate();
	}

	public async handleConnectionUpdate() {
		const { connection, lastDisconnect } = this.events;
		switch (connection) {
			case 'connecting':
				await this.handleConnecting();
				break;
			case 'close':
				await this.handleClose(lastDisconnect);
				break;
			case 'open':
				await this.handleOpen();
				break;
		}
	}

	private async handleConnecting() {
		print.info('Connecting to WhatsApp...');
		await syncPlugins('../plugins', ['.ts']);
		print.succeed('Plugins Installed');
	}

	private async handleClose(
		lastDisconnect?: BaileysEventMap['connection.update']['lastDisconnect'],
	) {
		const error = lastDisconnect?.error as Boom;
		const statusCode = error?.output?.statusCode;

		/**
		 * Handles logout
		 */
		if (statusCode === DisconnectReason.loggedOut) {
			this.client.ev.flush(true);
			await this.client.ws.close();
			process.exit(1);
		}

		/** Handles permature requests */
		if (statusCode === DisconnectReason.badSession) {
			process.exit();
		}
	}

	private async handleOpen() {
		print.succeed('Connected to WhatsApp');
		await this.hooks();
	}

	private async hooks() {
		if (this.client?.user?.id) {
			const cmdsList = commands.filter(cmd => !cmd.dontAddCommandList);
			await this.client.sendMessage(this.client.user.id, {
				text: `\`\`\`Bot is connected\nOwner: ${this.client.user.name ?? 'Unknown'}\nCommands: ${cmdsList.length}\`\`\``.trim(),
			});
		}
		const sudo = await getSettings().then(s => s.sudo);
		const users = Array.from(
			new Set([
				parseJid(this.client.user?.id),
				parseJid(this.client.user?.lid),
				...sudo,
			]),
		);
		await setSettings('sudo', users);
	}
}
