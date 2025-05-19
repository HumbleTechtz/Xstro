import { Boom } from '@hapi/boom';
import { DisconnectReason } from 'baileys';
import { commands, syncPlugins } from '../../plugin.ts';
import { getSettings, setSettings } from '../../../models/index.ts';
import { auth, parseJidLid } from '../../../utils/index.ts';
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
		console.info('Connecting to WhatsApp...');
		await syncPlugins('../plugins', ['.ts']);
		console.info('Plugins Synced');
	}

	private async handleClose(
		lastDisconnect?: BaileysEventMap['connection.update']['lastDisconnect'],
	) {
		const error = lastDisconnect?.error as Boom;
		const reason = error?.output?.statusCode;

		/** List of disconnect reasons that warrant a safe exit */
		const resetReasons = [
			DisconnectReason.connectionClosed,
			DisconnectReason.connectionLost,
			DisconnectReason.timedOut,
			DisconnectReason.connectionReplaced,
		];

		const resetWithClearStateReasons = [
			DisconnectReason.loggedOut,
			DisconnectReason.badSession,
		];

		if (resetReasons.includes(reason)) {
			console.warn(`Disconnected: ${reason} — resetting`);
			process.exit(0);
		} else if (resetWithClearStateReasons.includes(reason)) {
			console.warn(`Critical error: ${reason} — clearing state and exiting`);
			/** Clean up memory */
			this.client.ev.flush(true);
			/** Close the websocket */
			await this.client.ws.close();
			/** Clear the authenication state */
			await auth.truncate();

			console.log('Cleared auth state');
			process.exit(1);
		} else if (reason === DisconnectReason.restartRequired) {
			console.info('Restart required — exiting to allow restart');
			process.exit(0);
		} else {
			console.error('Unexpected disconnect reason:', reason);
			try {
				await auth.truncate();
				console.log('Cleared auth state');
			} catch (e) {
				console.error('Failed to clear auth state:', e);
			}
			console.log('Please re-pair again');
			process.exit(1);
		}
	}

	private async handleOpen() {
		console.info('Connected to WhatsApp');

		const userId = this.client?.user?.id;
		const userLid = this.client?.user?.lid;
		const userName = this.client?.user?.name ?? 'Unknown';

		if (userId) {
			const availableCommands = commands.filter(cmd => !cmd.dontAddCommandList);
			await this.client.sendMessage(userId, {
				text: `\`\`\`
Bot is connected
Owner: ${userName}
Commands: ${availableCommands.length}
\`\`\``.trim(),
			});
		}

		/** Update sudo settings */
		const existingSudo = await getSettings().then(s => s.sudo);
		const owner = Array.from(
			new Set([parseJidLid(userId), parseJidLid(userLid), ...existingSudo]),
		);

		await setSettings('sudo', owner);
	}
}
