import { Command } from "../../client/Core/";
import {
	setAutoMute,
	delAutoMute,
	getAutoMute,
} from "../../client/Models";
import { isValidTimeString } from "../../client/Utils/constants";

Command({
	name: "amute",
	fromMe: false,
	isGroup: true,
	desc: "Automatically mute at a specific time",
	type: "muting",
	function: async (msg, args) => {
		const { prefix, jid } = msg;
		if (!args || args.length < 1) {
			return await msg.send("```Usage: " + prefix[0] + "amute 5:30pm```");
		}

		const startTime = args.trim().toLowerCase();
		if (!isValidTimeString(startTime)) {
			return await msg.send(
				"Invalid time format. Use format like `5:30pm` or `7:00am`.",
			);
		}

		await setAutoMute(jid, startTime);
		return await msg.send(
			`_Group will be auto-muted everyday at ${startTime.toUpperCase()}._`,
		);
	},
});

Command({
	name: "aunmute",
	fromMe: false,
	isGroup: true,
	desc: "Automatically unmute at a specific time",
	type: "muting",
	function: async (msg, args) => {
		const { prefix, jid } = msg;
		if (!args || args.length < 1) {
			return await msg.send("```Usage: " + prefix[0] + "aunmute 6:30am```");
		}

		const endTime = args.trim().toLowerCase();
		if (!isValidTimeString(endTime)) {
			return await msg.send(
				"Invalid time format. Use format like `6:30am` or `8:00pm`.",
			);
		}

		const existing = await getAutoMute(jid);
		const startTime = existing?.startTime ?? null;

		await setAutoMute(jid, startTime as string, endTime);
		return await msg.send(
			`_Group will be auto-unmuted everyday at ${endTime.toUpperCase()}._`,
		);
	},
});

Command({
	name: "delmute",
	fromMe: false,
	isGroup: true,
	desc: "Delete automute setting for the group",
	type: "muting",
	function: async msg => {
		const { jid } = msg;
		await delAutoMute(jid);
		return await msg.send("_Automute setting deleted for this group._");
	},
});

Command({
	name: "getmute",
	fromMe: false,
	isGroup: true,
	desc: "Get current automute setting for the group",
	type: "muting",
	function: async msg => {
		const { jid } = msg;
		const automute = await getAutoMute(jid);
		if (!automute) {
			return await msg.send("_No automute setting found for this group._");
		}

		const { startTime, endTime } = automute;
		return await msg.send(
			`_Automute is currently set${startTime ? ` from ${startTime}` : ""}${endTime ? ` to ${endTime}` : ""}._`,
		);
	},
});
