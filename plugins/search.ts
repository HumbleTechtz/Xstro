import { searchWeb } from "../client/Utils";
import type { CommandModule } from "../client/Core";

export default [
	{
		pattern: "search",
		fromMe: false,
		isGroup: false,
		desc: "Make Web Search",
		type: "search",
		run: async (msg, args) => {
			if (!args) return msg.send("_Provide Search Query_");
			const results = await searchWeb(args);
			return msg.send(results);
		},
	},
] satisfies CommandModule[];
