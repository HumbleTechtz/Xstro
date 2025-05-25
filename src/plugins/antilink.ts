import { type WASocket } from 'baileys';
import { Command } from '../messaging/plugin.ts';
import { delAntilink, getAntilink, setAntilink } from '../models/antilink.ts';
import { isAdmin, isBotAdmin } from '../utils/constants.ts';

Command({
	name: 'antilink',
	fromMe: false,
	isGroup: true,
	desc: 'Setup Antilink for Group Chat',
	type: 'group',
	function: async (msg, args) => {
		const { prefix, jid } = msg;
		if (!args) {
			return await msg.send(
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
			return await msg.send('_Antilink turned on_');
		}
		if (choice[0] === 'off') {
			await delAntilink(jid);
			return await msg.send('_Antilink turned off_');
		}

		if (choice[0] === 'mode') {
			if (choice[1] !== 'kick' && choice[1] !== 'delete')
				return await msg.send(
					`\`\`\`Usage:\n${prefix}antilink mode kick\nOR\n${prefix}antilink mode delete\`\`\``,
				);
			await setAntilink(jid, choice[1] === 'kick' ? true : false);
			return await msg.send(
				'_Antilink mode is now set to ' + choice[1] + ' participant_',
			);
		}

		if (choice[0] === 'set') {
			if (!choice?.[1])
				return await msg.send(
					'_You need to add some specific links to prohibit_',
				);
			await setAntilink(jid, true, choice.slice(1));
			return await msg.send(
				`_Antilink set to handle ${choice.slice(1).length} links_`,
			);
		}
	},
});

Command({
	on: true,
	dontAddCommandList: true,
	function: async msg => {
		if (!msg.isGroup || !msg?.text) return;
		if (msg.key.fromMe || msg.sudo) return;
		if (
			!(await isBotAdmin(msg.client as WASocket, msg.jid)) ||
			(await isAdmin(msg.jid, msg.sender))
		)
			return;

		const antilink = await getAntilink(msg.jid);
		if (!antilink) return;

		const text = msg.text.toLowerCase();
		let hasProhibitedLink = false;

		if (antilink.links?.length) {
			hasProhibitedLink = antilink.links.some(link =>
				text.includes(link.toLowerCase()),
			);
		} else {
			hasProhibitedLink =
				/https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?/i.test(text);
		}

		if (!hasProhibitedLink) return;

		await msg.delete();

		if (antilink.mode === true) {
			await msg.client.groupParticipantsUpdate(
				msg.jid,
				[msg.sender!],
				'remove',
			);
			await msg.send(
				`_@${msg.sender!.split('@')[0]} was removed for sending a prohibited link_`,
				{ mentions: [msg.sender!] },
			);
		} else {
			await msg.send('_Links are not allowed here_');
		}
	},
});
