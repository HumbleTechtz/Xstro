import util from "util";
import chalk from "chalk";
import plugins from "../client/handlers";
import { Serialize, serialize } from "../client";
import { cachedGroupMetadata, saveMessage } from "../schemas";
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
			return Promise.all([
				this.eval(serialized),
				plugins(serialized),
				this.logMessage(serialized),
			]);
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
	private async logMessage(message: Serialize) {
		const jid = message.chat;
		const sender = message.pushName || "unknown";
		const group = message.isGroup ? cachedGroupMetadata(jid).subject : null;
		const content = message.text || message.msg_type
		const now = new Date();
		const time = now.toLocaleTimeString("en-US", { hour12: false });
		const day = now.toDateString();

		const border = chalk.yellow("─".repeat(42));
		const header = chalk.yellow(`╭${border}╮`);
		const footer = chalk.yellow(`╰${border}╯`);

		const line = (label: string, value: string) =>
			chalk.yellow("│ ") + chalk.yellow.bold(label.padEnd(9)) + value;

		const log = [
			header,
			...(group ? [line("GROUP:", group)] : []),
			line("FROM:", sender),
			line("MESSAGE:", content),
			line("TIME:", `${day}, ${time}`),
			footer,
		];

		console.log(log.join("\n"));
	}
}
