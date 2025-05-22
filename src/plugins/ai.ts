import { chatGpt } from '../utils/ai.ts';
import { Command } from '../messaging/plugin.ts';
import { fetch, urlBuffer } from '../utils/fetch.mts';

Command({
	name: 'gpt',
	fromMe: false,
	isGroup: false,
	desc: 'Chat with Open Ai Gpt',
	type: 'ai',
	function: async (message, match) => {
		const { pushName } = message;

		if (!match) {
			return message.send(`_${pushName ?? ''} How can I help You?_`);
		}
		return await message.send(await chatGpt(match));
	},
});

Command({
	name: 'gemini',
	fromMe: false,
	isGroup: false,
	desc: 'Chat with Open Ai Gemini',
	type: 'ai',
	function: async (message, match) => {
		const { pushName } = message;

		if (!match) {
			return message.send(`_${pushName ?? ''} How can I help You?_`);
		}
		return await message.send(
			JSON.parse(await fetch(`https://bk9.fun/ai/gemini?q=${match}`)).BK9,
		);
	},
});

Command({
	name: 'genimg',
	fromMe: false,
	isGroup: false,
	desc: 'Generate an image with Ai',
	type: 'ai',
	function: async (message, match) => {
		if (!match) {
			return message.send(`_Usage: ${message.prefix[0]}genimg <prompt>_`);
		}
		return await message.send(`https://bk9.fun/ai/magicstudio?prompt=${match}`);
	},
});
