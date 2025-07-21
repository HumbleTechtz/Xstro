import { restart, shutdown } from "../utils/constants.ts";
import type { CommandModule } from "../../Types/index.ts";

export default [
	{
		pattern: "restart",
		aliases: ["reboot"],
		fromMe: true,
		isGroup: false,
		desc: "Restart the bot",
		type: "system",
		handler: async msg => {
			await msg.send("Restarting...");
			restart();
		},
	},
	{
		pattern: "shutdown",
		fromMe: true,
		isGroup: false,
		desc: "Shutdown the bot",
		type: "system",
		handler: async msg => {
			await msg.send("Shutting down...");
			shutdown();
		},
	},
] satisfies CommandModule[];
