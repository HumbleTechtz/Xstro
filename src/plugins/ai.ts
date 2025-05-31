import { Command } from "../messaging/plugin.ts";
import { askAI } from "../utils/scraper.mts";

Command({
	name: "ai",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Ai",
	type: "ai",
	function: async (msg, match) => {
		if (!match) return msg.send(`_Usage: ${msg.prefix[0]}ai <prompt>_`);
		return await msg.send(await askAI("ai", match));
	},
});

Command({
	name: "llama",
	fromMe: false,
	isGroup: false,
	desc: "llama ai interaction",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}llama <prompt>_`);
		return await message.send(await askAI("llama", match));
	},
});

Command({
	name: "genimg",
	fromMe: false,
	isGroup: false,
	desc: "Generate an image with AI",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}genimg <prompt>_`);
		return await message.send(await askAI("dalle", match));
	},
});

Command({
	name: "nikka",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Nikka AI",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}nikka <prompt>_`);
		return await message.send(await askAI("nikka", match));
	},
});

Command({
	name: "jeevs",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Jeevs AI",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}jeevs <prompt>_`);
		return await message.send(await askAI("jeevs", match));
	},
});

Command({
	name: "maths",
	fromMe: false,
	isGroup: false,
	desc: "Solve a math problem",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}maths <equation>_`);
		return await message.send(await askAI("maths", match));
	},
});
