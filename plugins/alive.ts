import { Command } from "../client/Core";
import { getAlive, SetAlive } from "../client/Models";
import { formatRuntime, fact, getAdvice, getQuote } from "../client/Utils";

Command({
	name: "alive",
	fromMe: false,
	isGroup: false,
	desc: "Get Alive message",
	type: "misc",
	function: async (msg, match) => {
		if (match) await SetAlive(match);
		let aliveMsg = await getAlive();

		const replacements: { [key: string]: string | Promise<string> } = {
			"@user": `@${msg.sender.split("@")[0]}`,
			"@owner": msg.owner?.jid ? `@${msg.owner.jid.split("@")[0]}` : "",
			"@fact": fact(),
			"@quote": getQuote(),
			"@advice": getAdvice(),
			"@uptime": formatRuntime(process.uptime()),
			"@runtime": formatRuntime(process.uptime()),
		};

		const mentions = [];
		for (const key of ["@user", "@owner"]) {
			if (aliveMsg.includes(key) && replacements[key]) {
				mentions.push(key === "@user" ? msg.sender : msg.owner.jid);
			}
		}

		for (const [key, value] of Object.entries(replacements)) {
			if (aliveMsg.includes(key)) {
				const replacement = typeof value === "string" ? value : await value;
				aliveMsg = aliveMsg.replace(key, replacement);
			}
		}

		return await msg.send(aliveMsg, { jid: msg.chat, mentions });
	},
});
