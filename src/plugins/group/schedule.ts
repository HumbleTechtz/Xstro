import { Command } from "../../messaging/plugin.ts";

Command({
	name: "schedule",
	fromMe: false,
	isGroup: true,
	desc: "Schedule a message in the group chat",
	type: "schedule",
	function: async (msg, args) => {
		const { prefix, jid } = msg;
		if (!args) {
			return await msg.send("Usage: " + prefix + "schedule <time> <message>");
		}
		return await msg.send(
			`_This feature is not implemented yet. Please check back later._\n\nUsage: ${prefix}schedule <time> <message>`,
		);
	},
});

Command({
	name: "unschedule",
	fromMe: false,
	isGroup: true,
	desc: "Unschedule a message in the group chat",
	type: "schedule",
	function: async (msg, args) => {
		const { prefix, jid } = msg;
		if (!args) {
			return await msg.send("Usage: " + prefix + "unschedule <message_id>");
		}
		return await msg.send(
			`_This feature is not implemented yet. Please check back later._\n\nUsage: ${prefix}unschedule <message_id>`,
		);
	},
});

Command({
	name: "scheduled",
	fromMe: false,
	isGroup: true,
	desc: "List all scheduled messages in the group chat",
	type: "schedule",
	function: async msg => {
		const { jid } = msg;
		return await msg.send(
			`_This feature is not implemented yet. Please check back later._\n\nUsage: ${msg.prefix}scheduled`,
		);
	},
});
