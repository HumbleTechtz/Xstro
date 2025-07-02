import { getAlive, SetAlive } from "../schemas";
import { formatRuntime, fact, getAdvice, getQuote } from "../common";
import type { CommandModule } from "../client";

export default {
	pattern: "alive",
	fromMe: false,
	isGroup: false,
	desc: "Get Alive message",
	type: "misc",
	run: async (msg, match) => {
		if (match) SetAlive(match);

		let aliveMsg = getAlive();

		const replacements: Record<string, string | Promise<string>> = {
			"@user": `@${msg.sender.split("@")[0]}`,
			"@owner": msg.owner?.jid ? `@${msg.owner.jid.split("@")[0]}` : "",
			"@fact": fact(),
			"@quote": getQuote(),
			"@advice": getAdvice(),
			"@uptime": formatRuntime(process.uptime()),
			"@runtime": formatRuntime(process.uptime()),
		};

		const mentions = [];
		if (aliveMsg.includes("@user")) mentions.push(msg.sender);
		if (aliveMsg.includes("@owner") && msg.owner?.jid)
			mentions.push(msg.owner.jid);

		for (const [key, value] of Object.entries(replacements)) {
			if (aliveMsg.includes(key)) {
				const rep = typeof value === "string" ? value : await value;
				aliveMsg = aliveMsg.replace(key, rep);
			}
		}

		return msg.send(aliveMsg, { jid: msg.chat, mentions });
	},
} satisfies CommandModule;
