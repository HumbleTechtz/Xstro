import { Command } from "../../client/Core/";
import {
	setGroupEvent,
	getGroupEvent,
	delGroupEvent,
} from "../../client/Models";

Command({
	name: "event",
	fromMe: true,
	isGroup: true,
	desc: "Enable or disable group event mode",
	type: "group",
	function: async (msg, args) => {
		const groupJid = msg.chat;

		if (!args) {
			const state = getGroupEvent(groupJid) ? "ON" : "OFF";
			return msg.send(`_Group event mode is currently: ${state.toLowerCase()}_`);
		}

		const mode = args.toLowerCase();
		if (mode === "on") {
			setGroupEvent(groupJid, true);
			return msg.send("_Group event mode enabled_");
		}

		if (mode === "off") {
			delGroupEvent(groupJid);
			return msg.send("_Group event mode disabled_");
		}

		return msg.send("_Usage: event <on|off>_");
	},
});
