import { Command } from "../src/Core/plugin.ts";
import { getAlive, SetAlive } from "../src/Models/index.ts";
import { formatRuntime } from "../src/Utils/constants.ts";
import { fact, getAdvice, getQuote } from "../src/Utils/fun.ts";

Command({
	name: "alive",
	fromMe: false,
	isGroup: false,
	desc: "Get Alive message",
	type: "misc",
	function: async (msg, match) => {
		if (match) await SetAlive(match);
		return await msg.send(
			(
				await getAlive()
			)
				.replace("@user", `@${msg.sender.split("@")[0]}`)
				.replace("@owner", `@${msg.owner.jid.split("@")[0]}`)
				.replace("@fact", await fact())
				.replace("@quote", await getQuote())
				.replace("@advice", await getAdvice())
				.replace("@uptime", `${formatRuntime(process.uptime())}`)
				.replace("@runtime", `${formatRuntime(process.uptime())}`),
			{ mentions: [msg.sender, msg.owner.jid].filter(Boolean) }
		);
	},
});
