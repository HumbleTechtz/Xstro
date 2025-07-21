import type { CommandModule } from "src/Types";

export default {
	pattern: "ping",
	fromMe: false,
	desc: "Check response speed",
	type: "system",
	handler: async message => {
		const start = Date.now();
		const msg = await message.send("Pong!");
		const end = Date.now();
		return await message.edit(`${end - start} ms`, msg);
	},
} satisfies CommandModule;
