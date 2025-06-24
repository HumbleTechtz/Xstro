import { Command } from "../client/Core";
import { createMeme } from "../client/Media";

Command({
	name: "elon",
	fromMe: false,
	isGroup: false,
	desc: "Create a fake elonmusk tweet",
	type: "maker",
	function: async (message, args) => {
		if (!args) return message.send(`_Type something_`);
		return await message.send(await createMeme(args, "elonmusk"));
	},
});

Command({
	name: "andrew",
	fromMe: false,
	isGroup: false,
	desc: "Create a fake andrew tate tweet",
	type: "maker",
	function: async (message, args) => {
		if (!args) return message.send(`_Type something_`);
		return await message.send(await createMeme(args, "andrew"));
	},
});

Command({
	name: "messi",
	fromMe: false,
	isGroup: false,
	desc: "Create a fake messi tweet",
	type: "maker",
	function: async (message, args) => {
		if (!args) return message.send(`_Type something_`);
		return await message.send(await createMeme(args, "messi"));
	},
});

Command({
	name: "obama",
	fromMe: false,
	isGroup: false,
	desc: "Create a fake obama tweet",
	type: "maker",
	function: async (message, args) => {
		if (!args) return message.send(`_Type something_`);
		return await message.send(await createMeme(args, "obama"));
	},
});

Command({
	name: "ronaldo",
	fromMe: false,
	isGroup: false,
	desc: "Create a fake ronaldo tweet",
	type: "maker",
	function: async (message, args) => {
		if (!args) return message.send(`_Type something_`);
		return await message.send(await createMeme(args, "ronaldo"));
	},
});

Command({
	name: "trump",
	fromMe: false,
	isGroup: false,
	desc: "Create a fake trump tweet",
	type: "maker",
	function: async (message, args) => {
		if (!args) return message.send(`_Type something_`);
		return await message.send(await createMeme(args, "trump"));
	},
});