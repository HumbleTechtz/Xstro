import { Command } from '../messaging/plugin.ts';
import Message from '../messaging/Messages/Message.ts';

const adminCheck = async (message: Message): Promise<boolean> => {
	if (!(await message.isAdmin()) || !(await message.isBotAdmin())) {
		await message.send('_Requires admin and bot admin privileges_');
		return false;
	}
	return true;
};

const getUser = (message: Message, match: string | undefined) => {
	const user = message.user(match);
	if (!user) message.send('_Provide a number_');
	return user;
};

Command({
	name: 'add',
	fromMe: true,
	isGroup: true,
	desc: 'Add participant to group',
	type: 'group',
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		const user = getUser(message, match);
		if (!user) return;
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
		const user = getUser(message, match);
		if (!user) return;
		await message.client.groupParticipantsUpdate(message.jid, [user], 'remove');
		message.send(`_@${user.split('@')[0]} kicked from group_`, {
			mentions: [user],
		});
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
		const user = getUser(message, match);
		if (!user) return;
		const groupData = await message.client.groupMetadata(message.jid);
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
		const user = getUser(message, match);
		if (!user) return;
		const groupData = await message.client.groupMetadata(message.jid);
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
		const { participants } = await message.client.groupMetadata(message.jid);
		if (!participants?.length) return message.send('No participants');
		message.client.relayMessage(
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
		if (!match) return message.send('Provide new group name');
		if (!(await adminCheck(message))) return;
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
		const metadata = await message.client.groupMetadata(message.jid);
		if (metadata.announce) return message.send('Group already muted');
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
		const metadata = await message.client.groupMetadata(message.jid);
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
		const metadata = await message.client.groupMetadata(message.jid);
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
		const metadata = await message.client.groupMetadata(message.jid);
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
				`Usage:\n${message.prefix[0]}poll question; option1, option2, option3`,
			);
		}

		const [question, optionsRaw] = match.split(';').map(s => s.trim());
		const options = optionsRaw
			?.split(',')
			.map(opt => opt.trim())
			.filter(Boolean);

		if (options?.length! < 2) return message.send('Add at least 2 options.');

		await message.client.sendMessage(message.jid, {
			poll: { name: question!, values: options!, selectableCount: 1 },
		});
	},
});

Command({
	name: 'leave',
	fromMe: true,
	isGroup: true,
	desc: 'Leave a group',
	type: 'group',
	function: async msg => {
		return await msg.client.groupLeave(msg.jid);
	},
});
