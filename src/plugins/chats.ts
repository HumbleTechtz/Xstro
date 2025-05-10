import { Command } from '../messaging/plugins.ts';

Command({
	name: 'cpin',
	fromMe: true,
	isGroup: false,
	desc: 'Pin a chat',
	type: 'chats',
	function: async message => {
		await message.client.chatModify({ pin: true }, message.jid);
		return message.send('Pined.');
	},
});

Command({
	name: 'cunpin',
	fromMe: true,
	isGroup: false,
	desc: 'Unpin a chat',
	type: 'chats',
	function: async message => {
		await message.client.chatModify({ pin: false }, message.jid);
		return message.send('Unpined.');
	},
});

Command({
	name: 'archive',
	fromMe: true,
	isGroup: false,
	desc: 'Archive a chat',
	type: 'chats',
	function: async message => {
		await message.client.chatModify(
			{
				archive: true,
				lastMessages: [
					{ key: message.key, messageTimestamp: message.messageTimestamp },
				],
			},
			message.jid,
		);
		return message.send('Archived.');
	},
});

Command({
	name: 'unarchive',
	fromMe: true,
	isGroup: false,
	desc: 'Unarchive a chat',
	type: 'chats',
	function: async message => {
		await message.client.chatModify(
			{
				archive: false,
				lastMessages: [
					{ key: message.key, messageTimestamp: message.messageTimestamp },
				],
			},
			message.jid,
		);
		return message.send('Unarchived.');
	},
});

Command({
	name: 'clear',
	fromMe: true,
	isGroup: false,
	desc: 'Clear a chat',
	type: 'chats',
	function: async message => {
		await message.client.chatModify(
			{
				delete: true,
				lastMessages: [
					{ key: message.key, messageTimestamp: message.messageTimestamp },
				],
			},
			message.jid,
		);
		return message.send('Cleared.');
	},
});

Command({
	name: 'delete',
	fromMe: true,
	isGroup: false,
	desc: 'Delete a chat',
	type: 'chats',
	function: async message => {
		return await message.client.chatModify(
			{
				delete: true,
				lastMessages: [
					{ key: message.key, messageTimestamp: message.messageTimestamp },
				],
			},
			message.jid,
		);
	},
});

Command({
	name: 'star',
	fromMe: true,
	isGroup: false,
	desc: 'Star a message',
	type: 'chats',
	function: async msg => {
		if (!msg.quoted) {
			return msg.send('Reply a message to star');
		}
		const { id, fromMe } = msg.quoted.key as { id: string; fromMe: boolean };

		await msg.client.chatModify(
			{
				star: {
					messages: [{ id, fromMe }],
					star: true,
				},
			},
			msg.jid,
		);
		return msg.send('Starred.');
	},
});

Command({
	name: 'unstar',
	fromMe: true,
	isGroup: false,
	desc: 'Unstar a message',
	type: 'chats',
	function: async msg => {
		if (!msg.quoted) {
			return msg.send('Reply a message to unstar');
		}
		const { id, fromMe } = msg.quoted.key as { id: string; fromMe: boolean };

		await msg.client.chatModify(
			{
				star: {
					messages: [{ id, fromMe }],
					star: false,
				},
			},
			msg.jid,
		);
		return msg.send('Unstarred.');
	},
});

Command({
	name: 'pin',
	fromMe: false,
	isGroup: false,
	desc: 'Pin a message',
	type: 'chats',
	function: async message => {
		if (!message.quoted) {
			return message.send('Reply a message to pin it.');
		}
		return await message.client.sendMessage(message.jid, {
			pin: message.quoted.key,
			type: 1,
			time: 604800,
		});
	},
});

Command({
	name: 'unpin',
	fromMe: false,
	isGroup: false,
	desc: 'Unpin a message',
	type: 'chats',
	function: async message => {
		if (!message.quoted) {
			return message.send('Reply a message to pin it.');
		}
		return await message.client.sendMessage(message.jid, {
			pin: message.quoted.key,
			type: 2,
			time: undefined,
		});
	},
});
