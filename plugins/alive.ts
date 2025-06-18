import { Command } from "../src/Core/plugin.ts";
import { getAlive, SetAlive } from "../src/Models/index.ts";

Command({
	name: "alive",
	fromMe: false,
	isGroup: false,
	desc: "Get Alive message",
	type: "misc",
	function: async (msg, match) => {
		if (match) await SetAlive(match);
		return await msg.send(await getAlive());
	},
});
