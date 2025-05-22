import { Command } from '../messaging/plugin.ts';
import { fetch, isUrl, urlBuffer, lyrics, uploadFile } from '../utils/index.ts';

Command({
	name: 'url',
	fromMe: false,
	isGroup: false,
	desc: 'Shorten a url',
	type: 'tools',
	function: async (message, match) => {
		if (!match || !isUrl(match))
			return message.send('Provide a url to shorten');
		const url = await fetch(`https://tinyurl.com/api-create.php?url=${match}`);
		return await message.send(url);
	},
});

Command({
	name: 'getpp',
	fromMe: false,
	isGroup: false,
	desc: 'Get the profile picture of any person or group',
	type: 'tools',
	function: async (message, match) => {
		const user = message.user(match);
		if (!user) return message.send('Provide someone number');
		const profilePic = await message.client.profilePictureUrl(user, 'image');
		if (!profilePic)
			return message.send(
				'User has no profile picture, or maybe their settings is prevent the bot from seeing it.',
			);
		return await message.send(await urlBuffer(profilePic));
	},
});

Command({
	name: 'lyrics',
	fromMe: false,
	isGroup: false,
	desc: 'Get lyrics of any song',
	type: 'tools',
	function: async (message, match) => {
		if (!match) return message.send('_Provide a song name_');
		const data = await lyrics(match);
		if (data?.thumbnail) {
			return await message.send(await urlBuffer(data.thumbnail), {
				caption: data.lyrics,
			});
		} else {
			return await message.send(data?.lyrics!);
		}
	},
});

Command({
	name: 'carbon',
	fromMe: false,
	isGroup: false,
	desc: 'Create a carbon code',
	type: 'tools',
	function: async (message, match) => {
		if (!match) return message.send('_Provide a code_');

		const response = await urlBuffer(
			`https://bk9.fun/maker/carbonimg?q=${match}`,
		);

		await message.client.sendMessage(message.jid, {
			caption: 'Here is your carbon image',
			image: response,
			mimetype: 'image/png',
		});
	},
});

Command({
	name: 'enhance',
	fromMe: false,
	isGroup: false,
	desc: 'Enhance an image',
	type: 'tools',
	function: async message => {
		const msg = message.quoted;
		if (!msg || !msg.image) return message.send('Reply to an image');
		const buffer = await msg.downloadM();
		const url = await uploadFile(buffer);
		return await message.send(
			`https://bk9.fun/tools/enhance?url=${encodeURIComponent(url!)}`,
			{
				caption: 'Here is your enhanced image',
				mimetype: 'image/png',
			},
		);
	},
});
