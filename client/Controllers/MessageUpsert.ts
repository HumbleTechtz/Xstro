import makeCommands from "../Core/handlers";
import { Serialize, serialize } from "../Core";
import { save_message } from "../Models";
import util from "util";
import type { BaileysEventMap, WASocket } from "baileys";

export default class MessageUpsert {
	constructor(
		private client: WASocket,
		private event: BaileysEventMap["messages.upsert"]
	) {
		this.process();
	}

	private async process() {
		if (this.event.type !== "notify") return;

		await Promise.allSettled([save_message(this.event), this.handleMessages()]);
	}

	private async handleMessages() {
		const tasks = this.event.messages.map(async msg => {
			this.handleProtocolMessage(msg);
			const serialized = await serialize(this.client, structuredClone(msg));

			return Promise.all([
				this.handleEval(serialized),
				makeCommands(serialized),
			]);
		});

		await Promise.allSettled(tasks);
	}

	private handleProtocolMessage(msg: any) {
		const protocol = msg.message?.protocolMessage;
		if (protocol?.type === 0) {
			this.client.ev.emit("messages.delete", {
				keys: [{ ...protocol.key }],
			});
		}
	}

	private async handleEval(msg: Serialize) {
		if (!msg.sudo || !msg.text?.startsWith("$ ")) return;

		try {
			const result = await eval(`(async () => { ${msg.text.slice(2)} })()`);
			await msg.send(util.inspect(result, { depth: 1 }));
		} catch (error) {
			await msg.send(util.inspect(error, { depth: 1 }));
		}
	}
}
