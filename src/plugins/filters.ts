import { Command } from '../messaging/plugins.ts';
import { Filters, setFilter, getFilter, delFilter } from '../models/filter.ts';

Command({
 name: 'filter',
 fromMe: true,
 isGroup: false,
 desc: 'Filter Menu',
 type: 'filter',
 function: async (msg) => {
  return await msg.send(
   `\`\`\`Filters Menu:
${msg.prefix[0]}pfilter <name>:<response>
${msg.prefix[0]}gfilter <name>
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
  await setFilter(name.trim(), response, true, msg.isGroup ? [msg.jid] : []);
  return await msg.send(`*Filter saved for _${name.trim()}_*`);
 },
});

Command({
 name: 'gfilter',
 fromMe: true,
 desc: 'Get filter by name',
 type: 'filter',
 function: async (msg, match) => {
  if (!match || !match.trim()) return await msg.send('Provide filter name');
  const name = match.trim();
  const data = await getFilter(name);
  if (!data) return await msg.send('Filter not found');
  return await msg.send(`\`\`\`${data.response}\`\`\`\n_For: ${name}_`);
 },
});

Command({
 name: 'getfilters',
 fromMe: true,
 desc: 'List all filters',
 type: 'filter',
 function: async (msg) => {
  const data = await Filters.findAll({ attributes: ['name'] });
  if (!data || data.length === 0) return await msg.send('No filters found');
  const names = data.map((f) => `_${f.name}_`).join(', ');
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
