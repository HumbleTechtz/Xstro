import { formatRuntime } from "..";
import type { CommandModule } from "src/Types";

export default {
	pattern: "runtime",
	aliases: ["uptime"],
	fromMe: false,
	isGroup: false,
	desc: "Get the bot's runtime",
	type: "system",
	handler: async msg => {
		return msg.send(formatRuntime(process.uptime()));
	},
} satisfies CommandModule;
