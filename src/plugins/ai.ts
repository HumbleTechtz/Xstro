import { chatGpt } from '../utils/chatbot.mts';
import { Command } from '../messaging/plugin.ts';

Command({
	name: 'gpt',
	fromMe: false,
	isGroup: false,
	desc: 'Chat with Open Ai Gpt',
	type: 'ai',
	function: async (message, match) => {
		const { pushName } = message;

		if (!match) {
			return message.send(`_${pushName} How can I help You?_`);
		}
		return await message.send(await chatGpt(match));
	},
});
