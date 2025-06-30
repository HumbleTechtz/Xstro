import util from "util";
import plugins from "../client/handlers";
import { Serialize, serialize } from "../client";
import { saveMessage } from "../schemas";
import type { BaileysEventMap, WASocket } from "baileys";

export default class {
	constructor(
		private client: WASocket,
		private event: BaileysEventMap["messages.upsert"]
	) {
		saveMessage(event);
		this.process();
	}

	private async process() {
		if (this.event.type !== "notify") return;

		this.event.messages.map(async msg => {
			this.ProtocolMessage(msg);
			const serialized = await serialize(this.client, structuredClone(msg));
			return Promise.all([this.eval(serialized), plugins(serialized)]);
		});
	}

	private ProtocolMessage(msg: any) {
		const protocol = msg.message?.protocolMessage;
		if (protocol?.type === 0) {
			this.client.ev.emit("messages.delete", {
				keys: [{ ...protocol.key }],
			});
		}
	}

	private async eval(message: Serialize) {
		if (!message.sudo || !message.text?.startsWith("$ ")) return;

		try {
			const result = await eval(`(async () => { ${message.text.slice(2)} })()`);
			await message.send(util.inspect(result, { depth: 1 }));
		} catch (error) {
			await message.send(util.inspect(error, { depth: 1 }));
		}
	}
}
