import { delay } from "baileys";
import { formatRuntime, restart, shutdown } from "../client/Utils";
import type { CommandModule } from "../client/Core";

export default [
	{
		pattern: "ping",
		fromMe: false,
		isGroup: false,
		desc: "Ping the bot",
		type: "system",
		run: async message => {
			const start = Date.now();
			const msg = await message.send("Pong!");
			const end = Date.now();
			return await msg.edit(`\`\`\`${end - start} ms\`\`\``);
		},
	},
	{
		pattern: "runtime",
		fromMe: false,
		isGroup: false,
		desc: "Get bot runtime",
		type: "system",
		run: async message => {
			return await message.send(formatRuntime(process.uptime()));
		},
	},
	{
		pattern: "restart",
		fromMe: true,
		isGroup: false,
		desc: "Restart the process",
		type: "system",
		run: async message => {
			await delay(2000);
			await message.send("Restarting");
			restart();
		},
	},
	{
		pattern: "shutdown",
		fromMe: true,
		isGroup: false,
		desc: "Shut down bot",
		type: "system",
		run: async msg => {
			await msg.send("Shutting down");
			shutdown();
		},
	},
] satisfies CommandModule[];
