import { setAutoMute, delAutoMute, getAutoMute } from "../../core/Models";
import { isValidTimeString } from "../../core/Utils/constants";
import type { CommandModule } from "../../core/Core";

export default [
	{
		pattern: "amute",
		fromMe: false,
		isGroup: true,
		desc: "Automatically mute at a specific time",
		type: "muting",
		run: async (msg, args) => {
			const { prefix } = msg;
			if (!args || args.length < 1) {
				return await msg.send("```Usage: " + prefix[0] + "amute 5:30pm```");
			}

			const startTime = args.trim().toLowerCase();
			if (!isValidTimeString(startTime)) {
				return await msg.send(
					"Invalid time format. Use format like `5:30pm` or `7:00am`."
				);
			}

			setAutoMute(msg.chat, startTime);
			return await msg.send(
				`_Group will be auto-muted everyday at ${startTime.toUpperCase()}._`
			);
		},
	},
	{
		pattern: "aunmute",
		fromMe: false,
		isGroup: true,
		desc: "Automatically unmute at a specific time",
		type: "muting",
		run: async (msg, args) => {
			const { prefix } = msg;
			if (!args || args.length < 1) {
				return await msg.send("```Usage: " + prefix[0] + "aunmute 6:30am```");
			}

			const endTime = args.trim().toLowerCase();
			if (!isValidTimeString(endTime)) {
				return await msg.send(
					"Invalid time format. Use format like `6:30am` or `8:00pm`."
				);
			}

			const existing = getAutoMute(msg.chat);
			const startTime = existing?.startTime ?? null;

			setAutoMute(msg.chat, startTime as string, endTime);
			return await msg.send(
				`_Group will be auto-unmuted everyday at ${endTime.toUpperCase()}._`
			);
		},
	},
	{
		pattern: "delmute",
		fromMe: false,
		isGroup: true,
		desc: "Delete automute setting for the group",
		type: "muting",
		run: async msg => {
			delAutoMute(msg.chat);
			return await msg.send("_Automute setting deleted for this group._");
		},
	},
	{
		pattern: "getmute",
		fromMe: false,
		isGroup: true,
		desc: "Get current automute setting for the group",
		type: "muting",
		run: async msg => {
			const automute = getAutoMute(msg.chat);
			if (!automute) {
				return await msg.send("_No automute setting found for this group._");
			}

			const { startTime, endTime } = automute;
			return await msg.send(
				`_Automute is currently set${startTime ? ` from ${startTime}` : ""}${
					endTime ? ` to ${endTime}` : ""
				}._`
			);
		},
	},
] satisfies CommandModule[];
