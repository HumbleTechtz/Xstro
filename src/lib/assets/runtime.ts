import { formatRuntime } from "../utils/constants.ts";
import type { CommandModule } from "../../Types/index.ts";

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
