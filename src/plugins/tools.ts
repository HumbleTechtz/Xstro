import { Command } from '../messaging/plugin.ts';
import { fetch, isUrl, urlBuffer, lyrics } from '@astrox11/utily';

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
