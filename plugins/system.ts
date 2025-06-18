import { delay } from "baileys";
import { Command } from "../src/Core/plugin.ts";
import { formatRuntime, restart, shutdown } from "../src/Utils/constants.ts";

Command({
	name: "ping",
	fromMe: false,
	isGroup: false,
	desc: "Ping the bot",
	type: "system",
	function: async message => {
		const start = Date.now();
		const msg = await message.send("Pong!");
		const end = Date.now();
		return await msg.editM(`\`\`\`${end - start} ms\`\`\``);
	},
});

Command({
	name: "runtime",
	fromMe: false,
	isGroup: false,
	desc: "Get bot runtime",
	type: "system",
	function: async message => {
		return await message.send(`\`\`\`${formatRuntime(process.uptime())}\`\`\``);
	},
});

Command({
	name: "restart",
	fromMe: true,
	isGroup: false,
	desc: "Restart the process",
	type: "system",
	function: async message => {
		await delay(2000);
		await message.send("*Restarting*");
		restart()
	},
});

Command({
	name: "shutdown",
	fromMe: true,
	isGroup: false,
	desc: "Shut down bot",
	type: "system",
	function: async msg => {
		await msg.send("*Bye.*");
		shutdown()
	},
});
