import { Command } from '../../messaging/plugin.ts';
import { getLastMessagesFromChat } from '../../models/messages.ts';
import { jidNormalizedUser } from 'baileys';

Command({
	name: 'active',
	fromMe: false,
	isGroup: true,
	desc: 'Get Active Group Members',
	type: 'group',
	function: async msg => {
		const messages = await getLastMessagesFromChat(msg.jid);
		const count: Record<string, number> = {};
		for (const { participant } of messages) {
			if (typeof participant === 'string')
				count[participant] = (count[participant] || 0) + 1;
		}
		const active = Object.entries(count)
			.filter(([_, c]) => c > 0)
			.sort((a, b) => b[1] - a[1])
			.map(([p, c]) => `@${jidNormalizedUser(p).split('@')[0]}: ${c}`)
			.join('\n');

		await msg.send(`*Active group members:*\n${active}`, {
			mentions: Object.keys(count),
		});
	},
});

Command({
	name: 'inactive',
	fromMe: false,
	isGroup: true,
	desc: 'Get Inactive Group Members',
	type: 'group',
	function: async msg => {
		const messages = await getLastMessagesFromChat(msg.jid);
		const count: Record<string, number> = {};
		for (const { participant } of messages) {
			if (typeof participant === 'string')
				count[participant] = (count[participant] || 0) + 1;
		}
		const all = [
			...new Set(messages.map(m => jidNormalizedUser(m.participant!))),
		];
		const inactive = all
			.filter(p => !count[p])
			.map(p => `@${jidNormalizedUser(p).split('@')[0]}`)
			.join('\n');

		if (!inactive) return await msg.send('```No inactive members found.```');

		await msg.send(`*Inactive group members:*\n${inactive}`, {
			mentions: Object.keys(count).length ? all.filter(p => !count[p]) : [],
		});
	},
});
