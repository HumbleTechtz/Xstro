import { getAntiCall } from "../Models/AntiCall.ts";
import type { BaileysEventMap, WASocket } from "baileys";

export default class Calls {
	client: WASocket;
	events: BaileysEventMap["call"];
	constructor(client: WASocket, events: BaileysEventMap["call"]) {
		this.client = client;
		this.events = events;
		this.processCallers();
	}
	async processCallers() {
		console.log(this.events);
		for (const update of this.events) {
			console.log(update);
			if (update.status === "offer") {
				const antiCall = await getAntiCall();
				console.log(`Is anticall enabled:`, antiCall);
				if (!antiCall || !antiCall.mode) continue;

				const caller = update.from;
				const chatId = update.chatId;

				if (antiCall.action === "block") {
					await this.client.rejectCall(update.id, caller);
					await this.client.sendMessage(chatId, {
						text: `\`\`\`@${
							caller.split("@")[0]
						} you have been blocked for calling.\`\`\``,
						mentions: [caller],
					});
					await this.client.updateBlockStatus(caller, "block");
					return;
				} else if (antiCall.action === "warn") {
					await this.client.rejectCall(update.id, caller);
					await this.client.sendMessage(chatId, {
						text: `\`\`\`@${caller.split("@")[0]} this is ${
							this.client.user?.name
						} Personal Assistant Xstro, and I have terminated your call, leave a message, no calls allowed.\`\`\``,
						mentions: [caller],
					});
					return;
				}
			}
		}
	}
}
