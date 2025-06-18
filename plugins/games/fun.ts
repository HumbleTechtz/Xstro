import { fetch } from "../../src/Utils/fetch.mts";
import { Command } from "../../src/Core/plugin.ts";
import {
	fact,
	getAdvice,
	getAffirmation,
	getCatFact,
	getDogFact,
	getInsult,
	getJoke,
	getKanyeQuote,
	getNumberFact,
	getQuote,
	getRizz,
} from "../../src/Utils/fun.ts";

Command({
	name: "rizz",
	fromMe: false,
	isGroup: false,
	desc: "Rizz your babe lol",
	type: "fun",
	function: async msg => {
		return await msg.send(await getRizz());
	},
});

Command({
	name: "insult",
	fromMe: false,
	isGroup: false,
	desc: "Insult one",
	type: "fun",
	function: async msg => {
		return await msg.send(await getInsult());
	},
});

Command({
	name: "joke",
	fromMe: false,
	isGroup: false,
	desc: "Get a random joke",
	type: "fun",
	function: async msg => {
		return await msg.send(await getJoke());
	},
});

Command({
	name: "advice",
	fromMe: false,
	isGroup: false,
	desc: "Get a random piece of advice",
	type: "fun",
	function: async msg => {
		return await msg.send(await getAdvice());
	},
});

Command({
	name: "fact",
	fromMe: false,
	isGroup: false,
	desc: "Get a random fact",
	type: "fun",
	function: async msg => {
		return await msg.send(await fact());
	},
});

Command({
	name: "quote",
	fromMe: false,
	isGroup: false,
	desc: "Get an inspirational quote",
	type: "fun",
	function: async msg => {
		return await msg.send(await getQuote());
	},
});

Command({
	name: "catfact",
	fromMe: false,
	isGroup: false,
	desc: "Get a random cat fact",
	type: "fun",
	function: async msg => {
		return await msg.send(await getCatFact());
	},
});

Command({
	name: "dogfact",
	fromMe: false,
	isGroup: false,
	desc: "Get a random dog fact",
	type: "fun",
	function: async msg => {
		return await msg.send(await getDogFact());
	},
});

Command({
	name: "number",
	fromMe: false,
	isGroup: false,
	desc: "Get a random number fact",
	type: "fun",
	function: async msg => {
		return await msg.send(await getNumberFact());
	},
});

Command({
	name: "affirmation",
	fromMe: false,
	isGroup: false,
	desc: "Get a positive affirmation",
	type: "fun",
	function: async msg => {
		return await msg.send(await getAffirmation());
	},
});

Command({
	name: "kanye",
	fromMe: false,
	isGroup: false,
	desc: "Get a Kanye West quote",
	type: "fun",
	function: async msg => {
		return await msg.send(await getKanyeQuote());
	},
});
