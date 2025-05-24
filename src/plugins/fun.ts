import { fetch } from '../utils/fetch.mts';
import { Command } from '../messaging/plugin.ts';

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

Command({
	name: 'joke',
	fromMe: false,
	isGroup: false,
	desc: 'Get a random joke',
	type: 'fun',
	function: async msg => {
		const response = await fetch(
			'https://official-joke-api.appspot.com/random_joke',
		);
		const joke = JSON.parse(response) as { setup: string; punchline: string };
		return await msg.send(`${joke.setup}\n${joke.punchline}`);
	},
});

Command({
	name: 'advice',
	fromMe: false,
	isGroup: false,
	desc: 'Get a random piece of advice',
	type: 'fun',
	function: async msg => {
		const response = await fetch('https://api.adviceslip.com/advice');
		const data = JSON.parse(response) as { slip: { advice: string } };
		return await msg.send(data.slip.advice);
	},
});

Command({
	name: 'fact',
	fromMe: false,
	isGroup: false,
	desc: 'Get a random fact',
	type: 'fun',
	function: async msg => {
		const response = await fetch(
			'https://uselessfacts.jsph.pl/random.json?language=en',
		);
		const data = JSON.parse(response) as { text: string };
		return await msg.send(data.text);
	},
});
