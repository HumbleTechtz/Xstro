import { setFilter, delFilter, getAllFilters } from "../client/Models";
import { escapeRegex } from "./group/antiword";
import type { CommandModule, Serialize } from "../client/Core";

function checkGroupFilterTrigger(msg: Serialize, text: string) {
	const mentioned = [...text.matchAll(/@(\w+)/g)].map(m => m[1]);
	const jid = msg.owner.jid.split("@")[0];
	const lid = msg.owner.lid.split("@")[0];
	const owner = mentioned.includes(jid) || mentioned.includes(lid);
	const quoted =
		msg.quoted?.sender === msg.owner.jid || msg.quoted?.sender === msg.owner.lid;
	return owner || quoted || msg.key.fromMe;
}

export default [
	{
		pattern: "filter",
		fromMe: true,
		isGroup: false,
		desc: "Filter Menu",
		type: "filter",
		run: async msg => {
			const menu = [
				"Filters Menu:",
				`${msg.prefix[0]}pfilter <n>:<response> (Private)`,
				`${msg.prefix[0]}gfilter <n>:<response> (Group)`,
				`${msg.prefix[0]}getfilters`,
				`${msg.prefix[0]}delfilter <n>`,
			].join("\n");
			return msg.send(`\`\`\`${menu}\`\`\``);
		},
	},
	{
		pattern: "pfilter",
		fromMe: true,
		desc: "Add or update filter",
		type: "filter",
		run: async (msg, match) => {
			if (!match?.includes(":")) return msg.send("Use format name:response");

			const [name, ...responseParts] = match.split(":");
			const response = responseParts.join(":").trim();
			if (!name?.trim() || !response) return msg.send("Name or response missing");

			setFilter(name.trim(), response, true, false);
			return msg.send(`*Filter saved for _${name.trim()}_*`);
		},
	},
	{
		pattern: "gfilter",
		fromMe: true,
		desc: "Add or update group filter",
		type: "filter",
		run: async (msg, match) => {
			if (!match?.includes(":")) return msg.send("Use format name:response");

			const [name, ...responseParts] = match.split(":");
			const response = responseParts.join(":").trim();
			if (!name?.trim() || !response) return msg.send("Name or response missing");

			setFilter(name.trim(), response, true, true);
			return msg.send(`*Group filter saved for _${name.trim()}_*`);
		},
	},
	{
		pattern: "getfilters",
		fromMe: true,
		desc: "List all filters",
		type: "filter",
		run: async msg => {
			const filters = getAllFilters();
			if (!filters.length) return msg.send("No filters found");

			const names = filters.map(f => `_${f.name}_`).join(", ");
			return msg.send(`\`\`\`Filters:\n${names}\`\`\``);
		},
	},
	{
		pattern: "delfilter",
		fromMe: true,
		desc: "Delete filter by name",
		type: "filter",
		run: async (msg, match) => {
			const name = match?.trim();
			if (!name) return msg.send("Provide filter name");

			const success = delFilter(name);
			return msg.send(success ? `Deleted filter _${name}_` : "Filter not found");
		},
	},
	{
		on: true,
		dontAddCommandList: true,
		run: async msg => {
			if (msg.key.fromMe) return;

			const text = msg.text?.trim().toLowerCase();
			if (!text) return;

			const filters = getAllFilters();
			const matched = filters.find(f => {
				const regex = new RegExp(`\\b${escapeRegex(f.name)}\\b`, "i");
				return regex.test(text);
			});

			if (!matched || !matched.status) return;

			if (matched.isGroup) if (!msg.isGroup) return;
			if (checkGroupFilterTrigger(msg, text)) return msg.send(matched.response!);
			else if (!msg.isGroup) return msg.send(matched.response!);
		},
	},
] satisfies CommandModule[];
