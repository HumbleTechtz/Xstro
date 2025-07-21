import { AutoMuteDb } from "../schema/index.ts";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default [
	{
		pattern: "amute",
		fromMe: false,
		isGroup: true,
		desc: "Automatically mute at a specific time",
		type: "muting",
		handler: async (msg, args) => {
			if (!args?.trim()) return msg.send(en.plugin.automute.amute_usage);

			const startTime = args.trim().toLowerCase();
			if (!isValidTimeString(startTime)) {
				return msg.send(en.plugin.automute.invalid_format);
			}

			await AutoMuteDb.set(msg.chat, startTime);
			return msg.send(
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
		handler: async (msg, args) => {
			if (!args?.trim()) return msg.send(en.plugin.automute.aunmute_usage);

			const endTime = args.trim().toLowerCase();
			if (!isValidTimeString(endTime)) {
				return msg.send(en.plugin.automute.invalid_format);
			}

			const existing = await AutoMuteDb.get(msg.chat);
			const startTime = existing?.startTime ?? null;

			await AutoMuteDb.set(msg.chat, startTime as string, endTime);
			return msg.send(
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
		handler: async msg => {
			await AutoMuteDb.remove(msg.chat);
			return msg.send(en.plugin.automute.deleted);
		},
	},
	{
		pattern: "getmute",
		fromMe: false,
		isGroup: true,
		desc: "Get current automute setting for the group",
		type: "muting",
		handler: async msg => {
			const automute = await AutoMuteDb.get(msg.chat);
			if (!automute) return msg.send(en.plugin.automute.not_found);

			const { startTime, endTime } = automute;
			return msg.send(
				`_Automute is currently set${startTime ? ` from ${startTime}` : ""}${
					endTime ? ` to ${endTime}` : ""
				}._`
			);
		},
	},
] satisfies CommandModule[];

function isValidTimeString(timeStr: string): boolean {
	const match = timeStr
		.trim()
		.toLowerCase()
		.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
	if (!match) return false;
	const [_, hours, minutes, period] = match;
	const h = parseInt(hours, 10);
	const m = parseInt(minutes, 10);
	return (
		h >= 1 && h <= 12 && m >= 0 && m <= 59 && (period === "am" || period === "pm")
	);
}
