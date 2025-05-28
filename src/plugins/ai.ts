import { chatGpt } from "../utils/ai.ts";
import { Command } from "../messaging/plugin.ts";
import { fetch } from "../utils/fetch.mts";
import AI from "./Helpers/ai.ts";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

Command({
	name: "gpt",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Open Ai Gpt",
	type: "ai",
	function: async (message, match) => {
		const { pushName } = message;

		if (!match) {
			return message.send(`_${pushName ?? ""} How can I help You?_`);
		}
		return await message.send(await chatGpt(match));
	},
});

Command({
	name: "gemini",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Open Ai Gemini",
	type: "ai",
	function: async (message, match) => {
		const { pushName } = message;

		if (!match) {
			return message.send(`_${pushName ?? ""} How can I help You?_`);
		}
		return await message.send(
			JSON.parse(await fetch(`https://bk9.fun/ai/gemini?q=${match}`)).BK9,
		);
	},
});

Command({
	name: "genimg",
	fromMe: false,
	isGroup: false,
	desc: "Generate an image with Ai",
	type: "ai",
	function: async (message, match) => {
		if (!match) {
			return message.send(`_Usage: ${message.prefix[0]}genimg <prompt>_`);
		}
		return await message.send(`https://bk9.fun/ai/magicstudio?prompt=${match}`);
	},
});

Command({
	name: "groq",
	fromMe: false,
	isGroup: false,
	desc: "grok ai interaction",
	type: "ai",
	function: async (message, match) => {
		if (!match) return message.send(`_Usage: ${message.prefix[0]}grok <prompt>_`);
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
		return await message.client.sendMessage(message.jid, messageContent, {
			quoted: message,
		});
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
		return await message.client.sendMessage(message.jid, messageContent, {
			quoted: message,
		});
	},
});
