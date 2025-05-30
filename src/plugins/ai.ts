import { Command } from "../messaging/plugin.ts";
import AI from "./tools/ai.ts";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

// GROQ
Command({
	name: "groq",
	fromMe: false,
	isGroup: false,
	desc: "grok ai interaction",
	type: "ai",
	function: async (message, match) => {
		if (!match) return message.send(`_Usage: ${message.prefix[0]}groq <prompt>_`);
		const res = await AI.groq(match);
		const logo = await readFile(path.join(cwd(), "src", "media", "social.jpg"));
		const messageContent = {
			text: res.trim(),
			contextInfo: {
				externalAdReply: {
					title: "GROK-Ai",
					body: message.pushName,
					mediaType: 1,
					thumbnail: logo,
					sourceUrl: "https://github.com/AstroXTeam/whatsapp-bot",
					thumbnailUrl: "https://github.com/AstroXTeam/whatsapp-bot",
					renderLargerThumbnail: false,
					showAdAttribution: true,
				},
			},
			quoted: message,
		};
		return await message.sendMessage(message.jid, messageContent, {
			quoted: message,
		});
	},
});

// LLAMA
Command({
	name: "llama",
	fromMe: false,
	isGroup: false,
	desc: "llama ai interaction",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}llama <prompt>_`);
		const res = await AI.llama(match);
		const logo = await readFile(path.join(cwd(), "src", "media", "social.jpg"));
		const messageContent = {
			text: res.trim(),
			contextInfo: {
				externalAdReply: {
					title: "llama-Ai",
					body: message.pushName,
					mediaType: 1,
					thumbnail: logo,
					sourceUrl: "https://github.com/AstroXTeam/whatsapp-bot",
					thumbnailUrl: "https://github.com/AstroXTeam/whatsapp-bot",
					renderLargerThumbnail: false,
					showAdAttribution: true,
				},
			},
		};
		return await message.sendMessage(message.jid, messageContent, {
			quoted: message,
		});
	},
});

// DALLE (genimg)
Command({
	name: "genimg",
	fromMe: false,
	isGroup: false,
	desc: "Generate an image with AI",
	type: "ai",
	function: async (message, match) => {
		if (!match) {
			return message.send(`_Usage: ${message.prefix[0]}genimg <prompt>_`);
		}
		return await message.send(await AI.dalle(match));
	},
});

// NIKKA
Command({
	name: "nikka",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Nikka AI",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}nikka <prompt>_`);
		return await message.send(await AI.nikka(match));
	},
});

// JEEVS
Command({
	name: "jeevs",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Jeevs AI",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}jeevs <prompt>_`);
		return await message.send(await AI.jeevs(match));
	},
});

// MATHS
Command({
	name: "maths",
	fromMe: false,
	isGroup: false,
	desc: "Solve a math problem",
	type: "ai",
	function: async (message, match) => {
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}maths <equation>_`);
		return await message.send(await AI.maths(match));
	},
});

// FLUX
Command({
	name: "flux",
	fromMe: false,
	isGroup: false,
	desc: "Flux image generation",
	type: "ai",
	function: async (message, match) => {
		if (!match) return message.send(`_Usage: ${message.prefix[0]}flux <prompt>_`);
		return await message.send(await AI.flux(match));
	},
});
