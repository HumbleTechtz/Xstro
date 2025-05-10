import { Command } from '../messaging/plugins.ts';
import {
	Filters,
	setFilter,
	delFilter,
	getAllFilters,
} from '../models/filter.ts';
import { escapeRegex } from './antiword.ts';

Command({
	name: 'filter',
	fromMe: true,
	isGroup: false,
	desc: 'Filter Menu',
	type: 'filter',
	function: async msg => {
		return await msg.send(
			`\`\`\`Filters Menu:
${msg.prefix[0]}pfilter <name>:<response> (Private)
${msg.prefix[0]}gfilter <name>:<response> (Group)
${msg.prefix[0]}getfilters
${msg.prefix[0]}delfilter <name>\`\`\``.trim(),
		);
	},
});

Command({
	name: 'pfilter',
	fromMe: true,
	desc: 'Add or update filter',
	type: 'filter',
	function: async (msg, match) => {
		if (!match || !match.includes(':'))
			return await msg.send('Use format name:response');
		const [name, ...rest] = match.split(':');
		const response = rest.join(':').trim();
		if (!name || !response) return await msg.send('Name or response missing');
		await setFilter(name.trim(), response, true, false); // updated
		return await msg.send(`*Filter saved for _${name.trim()}_*`);
	},
});

Command({
	name: 'gfilter',
	fromMe: true,
	desc: 'Add or update group filter',
	type: 'filter',
	function: async (msg, match) => {
		if (!msg.isGroup)
			return await msg.send('This command is only for group chats.');
		if (!match || !match.includes(':'))
			return await msg.send('Use format name:response');

		const [name, ...rest] = match.split(':');
		const response = rest.join(':').trim();
		if (!name || !response) return await msg.send('Name or response missing');

		await setFilter(name.trim(), response, true, true); // updated
		return await msg.send(`*Group filter saved for _${name.trim()}_*`);
	},
});

Command({
	name: 'getfilters',
	fromMe: true,
	desc: 'List all filters',
	type: 'filter',
	function: async msg => {
		const data = await Filters.findAll({ attributes: ['name'] });
		if (!data || data.length === 0) return await msg.send('No filters found');
		const names = data.map(f => `_${f.name}_`).join(', ');
		return await msg.send(`\`\`\`Filters:\n${names}\`\`\``);
	},
});

Command({
	name: 'delfilter',
	fromMe: true,
	desc: 'Delete filter by name',
	type: 'filter',
	function: async (msg, match) => {
		if (!match || !match.trim()) return await msg.send('Provide filter name');
		const name = match.trim();
		const deleted = await delFilter(name);
		if (!deleted) return await msg.send('Filter not found');
		return await msg.send(`Deleted filter _${name}_`);
	},
});

Command({
	on: true,
	dontAddCommandList: true,
	function: async msg => {
		if (msg.fromMe) return;

		const text = msg.text?.trim().toLowerCase();
		if (!text) return;

		const allFilters = await getAllFilters();

		const keyword = allFilters.find(filter => {
			const regex = new RegExp(`\\b${escapeRegex(filter.name)}\\b`, 'i');
			return regex.test(text);
		});

		if (!keyword || !keyword.status) return;

		if (keyword.isGroup) {
			if (!msg.isGroup) return;
			if (!msg.mention?.includes(msg.owner) || msg.fromMe) return;
		}

		return await msg.send(keyword.response);
	},
});
