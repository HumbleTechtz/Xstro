import { Command } from "../../src/Core/plugin.ts";
import { setGoodBye, getGoodBye, delGoodBye } from "../../src/Models/index.ts";

Command({
	name: "goodbye",
	fromMe: true,
	isGroup: true,
	desc: "Set, get, or remove goodbye message",
	type: "group",
	function: async (msg, args) => {
		const groupJid = msg.jid;

		if (!args) {
			const current = await getGoodBye(groupJid);
			const state = current ? "ON" : "OFF";
			const text = current || "_No goodbye message set._";
			return msg.send(`_Goodbye is ${state}_\n\n${text}`);
		}

		if (args.toLowerCase().trim() === "off") {
			await delGoodBye(groupJid);
			return msg.send("_Goodbye message removed._");
		}

		if (args.toLowerCase().trim() === "on") {
			return msg.send("```Provide the goodbye message after setting on.```");
		}

		await setGoodBye(groupJid, args);
		return msg.send("_Goodbye message set._");
	},
});
