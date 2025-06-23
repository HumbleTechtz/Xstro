import { Command } from "../client/Core";
import { setFilter, delFilter, getAllFilters } from "../client/Models";
import { escapeRegex } from "./group/antiword";

Command({
	name: "filter",
	fromMe: true,
	isGroup: false,
	desc: "Filter Menu",
	type: "filter",
	function: async msg => {
		const menu = [
			"Filters Menu:",
			`${msg.prefix[0]}pfilter <n>:<response> (Private)`,
			`${msg.prefix[0]}gfilter <n>:<response> (Group)`,
			`${msg.prefix[0]}getfilters`,
			`${msg.prefix[0]}delfilter <n>`,
		].join("\n");

		return await msg.send(`\`\`\`${menu}\`\`\``);
	},
});

Command({
	name: "pfilter",
	fromMe: true,
	desc: "Add or update filter",
	type: "filter",
	function: async (msg, match) => {
		if (!match?.includes(":")) {
			return await msg.send("Use format name:response");
		}

		const [name, ...responseParts] = match.split(":");
		const response = responseParts.join(":").trim();

		if (!name?.trim() || !response) {
			return await msg.send("Name or response missing");
		}

		await setFilter(name.trim(), response, true, false);
		return await msg.send(`*Filter saved for _${name.trim()}_*`);
	},
});

Command({
	name: "gfilter",
	fromMe: true,
	desc: "Add or update group filter",
	type: "filter",
	function: async (msg, match) => {
		if (!match?.includes(":")) {
			return await msg.send("Use format name:response");
		}

		const [name, ...responseParts] = match.split(":");
		const response = responseParts.join(":").trim();

		if (!name?.trim() || !response) {
			return await msg.send("Name or response missing");
		}

		await setFilter(name.trim(), response, true, true);
		return await msg.send(`*Group filter saved for _${name.trim()}_*`);
	},
});

Command({
	name: "getfilters",
	fromMe: true,
	desc: "List all filters",
	type: "filter",
	function: async msg => {
		const filters = await getAllFilters();

		if (!filters.length) {
			return await msg.send("No filters found");
		}

		const names = filters.map(f => `_${f.name}_`).join(", ");
		return await msg.send(`\`\`\`Filters:\n${names}\`\`\``);
	},
});

Command({
	name: "delfilter",
	fromMe: true,
	desc: "Delete filter by name",
	type: "filter",
	function: async (msg, match) => {
		const name = match?.trim();
		if (!name) {
			return await msg.send("Provide filter name");
		}

		const success = await delFilter(name);
		const message = success ? `Deleted filter _${name}_` : "Filter not found";
		return await msg.send(message);
	},
});

Command({
	on: true,
	dontAddCommandList: true,
	function: async msg => {
		if (msg.key.fromMe) return;

		const text = msg.text?.trim().toLowerCase();
		if (!text) return;

		const filters = await getAllFilters();
		const matchedFilter = filters.find(filter => {
			const regex = new RegExp(`\\b${escapeRegex(filter.name)}\\b`, "i");
			return regex.test(text);
		});

		if (!matchedFilter || !matchedFilter.status) return;

		if (matchedFilter.isGroup) {
			if (!msg.isGroup) return;

			const shouldRespond = checkGroupFilterTrigger(msg, text);
			if (shouldRespond) {
				return await msg.send(matchedFilter.response!);
			}
		} else if (!msg.isGroup) {
			return await msg.send(matchedFilter.response!);
		}
	},
});

function checkGroupFilterTrigger(msg: any, text: string): boolean {
	const mentionMatches = [...text.matchAll(/@(\w+)/g)].map(m => m[1]);
	const ownerJidUsername = msg.owner.jid.split("@")[0];
	const ownerLidUsername = msg.owner.lid.split("@")[0];

	const mentionsOwner =
		mentionMatches.includes(ownerJidUsername) ||
		mentionMatches.includes(ownerLidUsername);
	const quotedOwner =
		msg.quoted?.sender === msg.owner.jid ||
		msg.quoted?.sender === msg.owner.lid;

	return mentionsOwner || quotedOwner || msg.key.fromMe;
}
