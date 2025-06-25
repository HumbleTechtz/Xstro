import { Command } from "../client/Core";
import { searchWeb } from "../client/Utils";

Command({
	name: "search",
	fromMe: false,
	isGroup: false,
	desc: "Make Web Search",
	type: "search",
	function: async (msg, args) => {
		if (!args) return msg.send(`_Provide Search Query_`);
		const results = await searchWeb(args);
		return await msg.send(results);
	},
});
