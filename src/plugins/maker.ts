import { Command } from '../messaging/plugin.ts';
import { upload, urlBuffer } from '../utils/fetch.mts';

type LogoType =
	| 'wasted'
	| 'wanted'
	| 'trigger'
	| 'rainbow'
	| 'pixelate'
	| 'invert'
	| 'facepalm'
	| 'darkness';

async function meme(image: Buffer, type: LogoType) {
	try {
		const url = await upload(image);
		if (!url) return;
		return await urlBuffer(
			`https://bk9.fun/maker/${type}?url=${encodeURIComponent(url)}`,
		);
	} catch (err) {
		console.error(`Error in meme function: ${err}`);
	}
}

Command({
	name: 'wasted',
	fromMe: false,
	isGroup: false,
	desc: 'Wasted logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'wasted');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});

Command({
	name: 'wanted',
	fromMe: false,
	isGroup: false,
	desc: 'Wanted logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'wanted');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});

Command({
	name: 'trigger',
	fromMe: false,
	isGroup: false,
	desc: 'Trigger logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'trigger');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});

Command({
	name: 'rainbow',
	fromMe: false,
	isGroup: false,
	desc: 'Rainbow logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'rainbow');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});

Command({
	name: 'pixelate',
	fromMe: false,
	isGroup: false,
	desc: 'Pixelate logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'pixelate');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});

Command({
	name: 'invert',
	fromMe: false,
	isGroup: false,
	desc: 'Invert logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'invert');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});

Command({
	name: 'facepalm',
	fromMe: false,
	isGroup: false,
	desc: 'Facepalm logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'facepalm');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});

Command({
	name: 'darkness',
	fromMe: false,
	isGroup: false,
	desc: 'Darkness logo',
	type: 'maker',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await meme(await msg.downloadM(), 'darkness');
		if (!buffer) return message.send('Failed to generate image.');
		return await message.send(buffer);
	},
});
