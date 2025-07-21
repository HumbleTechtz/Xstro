import { getFact, getQuote } from "../resources/index.ts";
import { AliveDb } from "../schema/index.ts";
import { formatRuntime } from "../utils/constants.ts";
import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "alive",
	fromMe: false,
	isGroup: false,
	desc: "Get Alive message",
	type: "misc",
	handler: async (msg, match) => {
		if (match) await AliveDb.set(match);

		const aliveMsg = (await AliveDb.get())
			.replace("@user", `@${msg.sender.split("@")[0]}`)
			.replace("@owner", `@${msg.owner.jid.split("@")[0]}`)
			.replace("@facts", getFact())
			.replace("@uptime", formatRuntime(process.uptime()))
			.replace("@quotes", getQuote());

		return await msg.send(aliveMsg, {
			to: msg.chat,
			mentions: [msg.owner.jid, msg.sender].filter(Boolean),
		});
	},
} satisfies CommandModule;
