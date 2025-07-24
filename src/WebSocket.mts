import makeWASocket from "baileys";
import type { UserFacingSocketConfig, WASocket } from "baileys";

export default class {
	protected config: UserFacingSocketConfig;
	private socket: WASocket | null = null;

	constructor(config: UserFacingSocketConfig) {
		this.config = config;
	}

	init() {
		this.socket = makeWASocket({ ...this.config });
		return this.socket;
	}

	async close() {
		if (this.socket) {
			try {
				this.socket.ws.close();
				this.socket = null;
			} catch (e) {
				console.error(e);
				this.socket = null;
			}
		}
	}

	async restart() {
		await this.close();
		await new Promise(resolve => setTimeout(resolve, 1000));
		return this.init();
	}

	isConnected(): boolean {
		return this.socket.ws.isOpen;
	}

	getSocket(): WASocket | null {
		return this.socket;
	}
}
