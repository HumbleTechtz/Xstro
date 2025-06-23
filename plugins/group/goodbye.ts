import { Command } from "../../client/Core/";
import { setGoodBye, getGoodBye, delGoodBye } from "../../client/Models";

Command({
	name: "goodbye",
	fromMe: true,
	isGroup: true,
	desc: "Set, get, or remove goodbye message",
	type: "group",
	function: async (msg, args) => {
		const groupJid = msg.chat;

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
