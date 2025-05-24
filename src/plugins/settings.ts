import { Command } from '../messaging/plugin.ts';
import { setSettings } from '../models/settings.ts';

Command({
	name: 'setprefix',
	fromMe: true,
	isGroup: false,
	desc: 'Set handler for bot',
	type: 'settings',
	function: async (msgs, args) => {
		if (!args) {
			return await msgs.send(
				`_Prefix is needed, eg ${msgs.prefix[0]}setprefix ,_`,
			);
		}
		await setSettings('prefix', [args]);
		return await msgs.send(
			`_Bot Prefix updated to "${args}"_\nUsage: ${args}ping`,
		);
	},
});

Command({
	name: 'mode',
	fromMe: true,
	isGroup: false,
	desc: 'Set bot mode to be public or private',
	type: 'settings',
	function: async (message, match) => {
		if (!match || !['private', 'public'].includes(match.toLowerCase())) {
			return message.send(
				`*Usage:*\n${message.prefix[0]}mode private\n${message.prefix[0]}mode public`,
			);
		}
		if (message.mode && match.toLowerCase() === 'private') {
			return await message.send('_Already in Private Mode_');
		} else if (!message.mode && match.toLowerCase() === 'public') {
			return await message.send('_Already in Public Mode_');
		}

		const value = match.toLowerCase() === 'private' ? 1 : 0;
		await setSettings('mode', value);

		return await message.send(`_Bot is now in ${match.toLowerCase()} mode_`);
	},
});
