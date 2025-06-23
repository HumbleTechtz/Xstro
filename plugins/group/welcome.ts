import { Command } from "../../client/Core/";
import { setWelcome, getWelcome, delWelcome } from "../../client/Models";

Command({
	name: "welcome",
	fromMe: true,
	isGroup: true,
	desc: "Set, get, or remove welcome message",
	type: "group",
	function: async (msg, args) => {
		const groupJid = msg.chat;

		if (!args) {
			const current = await getWelcome(groupJid);
			const state = current ? "ON" : "OFF";
			const text = current || "_No welcome message set._";
			return msg.send(`_Welcome is ${state.toLowerCase()}_\n\n${text}`);
		}

		if (args.toLowerCase().trim() === "off") {
			await delWelcome(groupJid);
			return msg.send("_Welcome message removed._");
		}

		if (args.toLowerCase().trim() === "on") {
			return msg.send("```Provide the welcome message after on.```");
		}

		await setWelcome(groupJid, args);
		return msg.send("_Welcome message set._");
	},
});
