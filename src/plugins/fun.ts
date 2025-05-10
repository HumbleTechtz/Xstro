import { fetch } from '@astrox11/utily';
import { Command } from '../messaging/plugins.ts';

Command({
	name: 'rizz',
	fromMe: false,
	isGroup: false,
	desc: 'Rizz your babe lol',
	type: 'fun',
	function: async msg => {
		const data = JSON.parse(
			await fetch('https://rizzapi.vercel.app/random'),
		) as {
			text: string;
		};
		return await msg.send(data.text);
	},
});

Command({
	name: 'insult',
	fromMe: false,
	isGroup: false,
	desc: 'Insult one',
	type: 'fun',
	function: async msg => {
		const insult = await fetch('https://insult.mattbas.org/api/insult');
		return await msg.send(insult);
	},
});
