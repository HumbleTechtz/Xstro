import { Command } from "../../src/Core/plugin.ts";
import { upload } from "../../src/Utils/fetch.mts";

type LogoType =
	| "wasted"
	| "wanted"
	| "trigger"
	| "rainbow"
	| "pixelate"
	| "invert"
	| "facepalm"
	| "darkness";

async function meme(image: Buffer, type: LogoType) {
	const url = await upload(image);
	return `https://bk9.fun/maker/${type}?url=${url}`;
}

Command({
	name: "wasted",
	fromMe: false,
	isGroup: false,
	desc: "Wasted logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const image = await meme(await message.downloadM(msg), "wasted");
		return await message.send(image);
	},
});

Command({
	name: "wanted",
	fromMe: false,
	isGroup: false,
	desc: "Wanted logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const url = await meme(await message.downloadM(msg), "wanted");
		return await message.send(url);
	},
});

Command({
	name: "trigger",
	fromMe: false,
	isGroup: false,
	desc: "Trigger logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const url = await meme(await message.downloadM(msg), "trigger");
		return await message.send(url);
	},
});

Command({
	name: "rainbow",
	fromMe: false,
	isGroup: false,
	desc: "Rainbow logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const url = await meme(await message.downloadM(msg), "rainbow");
		return await message.send(url);
	},
});

Command({
	name: "pixelate",
	fromMe: false,
	isGroup: false,
	desc: "Pixelate logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const url = await meme(await message.downloadM(msg), "pixelate");
		return await message.send(url);
	},
});

Command({
	name: "invert",
	fromMe: false,
	isGroup: false,
	desc: "Invert logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const url = await meme(await message.downloadM(msg), "invert");
		return await message.send(url);
	},
});

Command({
	name: "facepalm",
	fromMe: false,
	isGroup: false,
	desc: "Facepalm logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const url = await meme(await message.downloadM(msg), "facepalm");
		return await message.send(url);
	},
});

Command({
	name: "darkness",
	fromMe: false,
	isGroup: false,
	desc: "Darkness logo",
	type: "maker",
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send("```Reply an Image```");
		const url = await meme(await message.downloadM(msg), "darkness");
		return await message.send(url);
	},
});
