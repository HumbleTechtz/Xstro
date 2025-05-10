import { Command } from '../messaging/plugin.ts';
import { delAntilink, setAntilink } from '../models/antilink.ts';

Command({
	name: 'antilink',
	fromMe: false,
	isGroup: true,
	desc: 'Setup Antilink for Group Chat',
	type: 'group',
	function: async (msg, args) => {
		const { send, prefix, jid } = msg;
		if (!args) {
			return await send(
				`\`\`\`
Usage: 
${prefix}antilink on
${prefix}antilink off
${prefix}antlink mode kick | delete
${prefix}antilink set chat.whatsapp.com,google.com\`\`\``,
			);
		}

		args = args.toLowerCase().trim();
		const choice = args.split(' ');
		if (choice[0] === 'on') {
			await setAntilink(jid, true);
			return await send('_Antilink turned on_');
		}
		if (choice[0] === 'off') {
			await delAntilink(jid);
			return await send('_Antilink turned off_');
		}

		if (choice[0] === 'mode') {
			if (choice[1] !== 'kick' && choice[1] !== 'delete')
				return await send(
					`\`\`\`Usage:\n${prefix}antilink mode kick\nOR\n${prefix}antilink mode delete\`\`\``,
				);
			await setAntilink(jid, choice[1] === 'kick' ? true : false);
			return await send(
				'_Antilink mode is now set to ' + choice[1] + ' participant_',
			);
		}

		if (choice[0] === 'set') {
			if (!choice?.[1])
				return await send('_You need to add some specific links to prohibit_');
			await setAntilink(jid, true, choice.slice(1));
			return await send(
				`_Antilink set to handle ${choice.slice(1).length} links_`,
			);
		}
	},
});
