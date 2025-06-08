import { fetch } from "../../src/Utils/fetch.mts";
import { Command } from "../../src/Core/plugin.ts";

Command({
	name: "rizz",
	fromMe: false,
	isGroup: false,
	desc: "Rizz your babe lol",
	type: "fun",
	function: async msg => {
		const data = JSON.parse(await fetch("https://rizzapi.vercel.app/random")) as {
			text: string;
		};
		return await msg.send(data.text);
	},
});

Command({
	name: "insult",
	fromMe: false,
	isGroup: false,
	desc: "Insult one",
	type: "fun",
	function: async msg => {
		const insult = await fetch("https://insult.mattbas.org/api/insult");
		return await msg.send(insult);
	},
});

Command({
	name: "joke",
	fromMe: false,
	isGroup: false,
	desc: "Get a random joke",
	type: "fun",
	function: async msg => {
		const response = await fetch(
			"https://official-joke-api.appspot.com/random_joke",
		);
		const joke = JSON.parse(response) as { setup: string; punchline: string };
		return await msg.send(`${joke.setup}\n${joke.punchline}`);
	},
});

Command({
	name: "advice",
	fromMe: false,
	isGroup: false,
	desc: "Get a random piece of advice",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://api.adviceslip.com/advice");
		const data = JSON.parse(response) as { slip: { advice: string } };
		return await msg.send(data.slip.advice);
	},
});

Command({
	name: "fact",
	fromMe: false,
	isGroup: false,
	desc: "Get a random fact",
	type: "fun",
	function: async msg => {
		const response = await fetch(
			"https://uselessfacts.jsph.pl/random.json?language=en",
		);
		const data = JSON.parse(response) as { text: string };
		return await msg.send(data.text);
	},
});

Command({
	name: "quote",
	fromMe: false,
	isGroup: false,
	desc: "Get an inspirational quote",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://zenquotes.io/api/random");
		const data = JSON.parse(response) as [{ q: string; a: string }];
		return await msg.send(`"${data[0].q}"\n\n— ${data[0].a}`);
	},
});

Command({
	name: "catfact",
	fromMe: false,
	isGroup: false,
	desc: "Get a random cat fact",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://catfact.ninja/fact");
		const data = JSON.parse(response) as { fact: string };
		return await msg.send(`🐱 ${data.fact}`);
	},
});

Command({
	name: "dogfact",
	fromMe: false,
	isGroup: false,
	desc: "Get a random dog fact",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://dogapi.dog/api/v2/facts");
		const data = JSON.parse(response) as {
			data: Array<{ attributes: { body: string } }>;
		};
		return await msg.send(`🐕 ${data.data[0].attributes.body}`);
	},
});

Command({
	name: "activity",
	fromMe: false,
	isGroup: false,
	desc: "Get a random activity suggestion",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://www.boredapi.com/api/activity");
		const data = JSON.parse(response) as {
			activity: string;
			type: string;
			participants: number;
			price: number;
		};
		return await msg.send(
			`💡 *Activity Suggestion*\n\n${data.activity}\n\n🏷️ Type: ${data.type}\n👥 Participants: ${data.participants}\n💰 Price: ${data.price === 0 ? "Free" : "$".repeat(Math.ceil(data.price * 4))}`,
		);
	},
});

Command({
	name: "number",
	fromMe: false,
	isGroup: false,
	desc: "Get a random number fact",
	type: "fun",
	function: async msg => {
		const randomNum = Math.floor(Math.random() * 1000);
		const response = await fetch(`http://numbersapi.com/${randomNum}`);
		return await msg.send(`🔢 ${response}`);
	},
});

Command({
	name: "affirmation",
	fromMe: false,
	isGroup: false,
	desc: "Get a positive affirmation",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://www.affirmations.dev/");
		const data = JSON.parse(response) as { affirmation: string };
		return await msg.send(`✨ ${data.affirmation}`);
	},
});

Command({
	name: "kanye",
	fromMe: false,
	isGroup: false,
	desc: "Get a Kanye West quote",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://api.kanye.rest/");
		const data = JSON.parse(response) as { quote: string };
		return await msg.send(`🎤 "${data.quote}"\n\n— Kanye West`);
	},
});

Command({
	name: "yes",
	fromMe: false,
	isGroup: false,
	desc: "Get a yes/no answer",
	type: "fun",
	function: async msg => {
		const response = await fetch("https://yesno.wtf/api");
		const data = JSON.parse(response) as {
			answer: string;
			forced: boolean;
			image: string;
		};

		return await msg.send(data.image, {
			caption: `${data.answer.toUpperCase()} 🎯`,
			type: "video",
		});
	},
});
