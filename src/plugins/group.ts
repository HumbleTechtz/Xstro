import { delay } from 'baileys';
import { Command } from '../messaging/plugin.ts';
import { cachedGroupMetadata } from '../models/group.ts';
import { adminCheck, parseId } from '../utils/constants.ts';

Command({
	name: 'add',
	fromMe: true,
	isGroup: true,
	desc: 'Add participant to group',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send('_Provide a valid number_');
		const user = `${match}@s.whatsapp.net`;
		if (!(await message.client.onWhatsApp(user))) {
			return message.send('_Invalid number_');
		}
		await message.client.groupParticipantsUpdate(message.jid, [user], 'add');
		message.send(`_@${user.split('@')[0]} added to group_`, {
			mentions: [user],
		});
	},
});

Command({
	name: 'kick',
	fromMe: false,
	isGroup: true,
	desc: 'Remove participant from group',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send('_Provide a valid number or mention_');
		const user = await parseId(match, message.jid);
		if (!user) return message.send('_Invalid number or mention_');
		await message.client.groupParticipantsUpdate(message.jid, [user], 'remove');
		message.send(`_@${user.split('@')[0]} kicked from group_`, {
			mentions: [user],
		});
	},
});

Command({
	name: 'kickall',
	fromMe: true,
	isGroup: true,
	desc: 'Kickall all participants from a Group',
	type: 'group',
	function: async message => {
		if (!(await adminCheck(message))) return;
		const groupData = await cachedGroupMetadata('120363286769939283@g.us');
		const participants = groupData.participants
			.filter(p => !p.admin)
			.map(p => p.id);

		await message.client.groupParticipantsUpdate(
			message.jid,
			participants,
			'remove',
		);
	},
});

Command({
	name: 'promote',
	fromMe: false,
	isGroup: true,
	desc: 'Promote participant to admin',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send('_Provide a valid number or mention_');
		const user = await parseId(match, message.jid);
		if (!user) return message.send('_Invalid number or mention_');
		const groupData = await cachedGroupMetadata(message.jid);
		const admins = groupData.participants.filter(v => v.admin).map(v => v.id);
		if (admins.includes(user)) {
			return message.send(`_@${user.split('@')[0]} is already admin_`, {
				mentions: [user],
			});
		}
		await message.client.groupParticipantsUpdate(
			message.jid,
			[user],
			'promote',
		);
		message.send(`_@${user.split('@')[0]} is now admin_`, {
			mentions: [user],
		});
	},
});

Command({
	name: 'demote',
	fromMe: false,
	isGroup: true,
	desc: 'Demote admin to participant',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send('_Provide a valid number or mention_');
		const user = await parseId(match, message.jid);
		if (!user) return message.send('_Invalid number or mention_');
		const groupData = await cachedGroupMetadata(message.jid);
		const admins = groupData.participants.filter(v => v.admin).map(v => v.id);
		if (!admins.includes(user)) {
			return message.send(`_@${user.split('@')[0]} is not admin_`, {
				mentions: [user],
			});
		}
		await message.client.groupParticipantsUpdate(message.jid, [user], 'demote');
		message.send(`_@${user.split('@')[0]} is no longer admin_`, {
			mentions: [user],
		});
	},
});

Command({
	name: 'newgc',
	fromMe: true,
	isGroup: false,
	desc: 'Create new group',
	type: 'group',
	function: async (message, match) => {
		if (!match) return message.send('_Provide group name_');
		const gc = await message.client.groupCreate(match, [message.owner]);
		const invite = await message.client.groupInviteCode(gc.id);
		const url = `https://chat.whatsapp.com/${invite}`;
		message.send(url, {
			contextInfo: {
				isForwarded: true,
				externalAdReply: {
					title: match,
					body: `Join ${match}`,
					sourceUrl: url,
					showAdAttribution: true,
				},
			},
		});
	},
});

Command({
	name: 'tag',
	fromMe: false,
	isGroup: true,
	desc: 'Mention entire group',
	type: 'group',
	function: async (message, match) => {
		const { participants } = await cachedGroupMetadata(message.jid);
		return await message.client.relayMessage(
			message.jid,
			{
				extendedTextMessage: {
					text: `@${message.jid} ${match ?? ''}`,
					contextInfo: {
						mentionedJid: participants.filter(p => p.id).map(p => p.id),
						groupMentions: [
							{ groupJid: message.jid, groupSubject: 'everyone' },
						],
					},
				},
			},
			{},
		);
	},
});

Command({
	name: 'gname',
	fromMe: false,
	isGroup: true,
	desc: 'Update group name',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send('_Provide new group name_');
		await message.client.groupUpdateSubject(message.jid, match);
		message.send('_Group name updated_');
	},
});

Command({
	name: 'gdesc',
	fromMe: false,
	isGroup: true,
	desc: 'Update group description',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send('_Provide new group description_');
		await message.client.groupUpdateDescription(message.jid, match);
		message.send('_Group description updated_');
	},
});

Command({
	name: 'mute',
	fromMe: false,
	isGroup: true,
	desc: 'Allow only admins to send messages',
	type: 'group',
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (metadata.announce) return message.send('_Group already muted_');
		await message.client.groupSettingUpdate(message.jid, 'announcement');
		message.send('_Group muted, only admins can send messages_');
	},
});

Command({
	name: 'unmute',
	fromMe: false,
	isGroup: true,
	desc: 'Allow all members to send messages',
	type: 'group',
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (!metadata.announce) return message.send('_Group already unmuted_');
		await message.client.groupSettingUpdate(message.jid, 'not_announcement');
		message.send('_Group unmuted, all members can send messages_');
	},
});

Command({
	name: 'lock',
	fromMe: false,
	isGroup: true,
	desc: 'Restrict settings to admins',
	type: 'group',
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (metadata.restrict)
			return message.send('_Group settings already restricted_');
		await message.client.groupSettingUpdate(message.jid, 'locked');
		message.send('_Group settings restricted to admins_');
	},
});

Command({
	name: 'unlock',
	fromMe: false,
	isGroup: true,
	desc: 'Allow all members to manage settings',
	type: 'group',
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (!metadata.restrict)
			return message.send('_Group settings already unrestricted_');
		await message.client.groupSettingUpdate(message.jid, 'unlocked');
		message.send('_Group settings unrestricted_');
	},
});

Command({
	name: 'invite',
	fromMe: false,
	isGroup: true,
	desc: 'Get group invite link',
	type: 'group',
	function: async message => {
		if (!(await adminCheck(message))) return;
		const code = await message.client.groupInviteCode(message.jid);
		message.send(`_https://chat.whatsapp.com/${code}_`);
	},
});

Command({
	name: 'revoke',
	fromMe: false,
	isGroup: true,
	desc: 'Revoke group invite code',
	type: 'group',
	function: async message => {
		if (!(await adminCheck(message))) return;
		const code = await message.client.groupRevokeInvite(message.jid);
		message.send(`_https://chat.whatsapp.com/${code}_`);
	},
});

Command({
	name: 'approval',
	fromMe: false,
	isGroup: true,
	desc: 'Toggle group join approval',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}approval on | off_`);
		match = match.toLowerCase().trim();
		if (match === 'on') {
			await message.client.groupJoinApprovalMode(message.jid, 'on');
			return message.send('_Approval mode on_');
		}
		if (match === 'off') {
			await message.client.groupJoinApprovalMode(message.jid, 'off');
			return message.send('_Approval mode off_');
		}
		return message.send(`_Usage: ${message.prefix[0]}approval on | off_`);
	},
});

Command({
	name: 'poll',
	fromMe: false,
	isGroup: true,
	desc: 'Create a poll message',
	type: 'group',
	function: async (message, match) => {
		if (!match || !match.includes(';')) {
			return message.send(
				`_Usage: ${message.prefix[0]}poll question; option1, option2, option3_`,
			);
		}
		const [question, optionsRaw] = match.split(';').map(s => s.trim());
		if (!question || !optionsRaw)
			return message.send('_Provide a question and options_');
		const options = optionsRaw
			.split(',')
			.map(opt => opt.trim())
			.filter(Boolean);
		if (options.length < 2) return message.send('_Add at least 2 options_');
		await message.client.sendMessage(message.jid, {
			poll: { name: question, values: options, selectableCount: 1 },
		});
	},
});

Command({
	name: 'leave',
	fromMe: true,
	isGroup: true,
	desc: 'Leave a group',
	type: 'group',
	function: async message => {
		await message.client.groupLeave(message.jid);
	},
});
