import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "jid",
	aliases: ["lid"],
	fromMe: true,
	desc: "fetch Jid/Lid",
	type: "misc",
	handler: msg => {
		return msg.send(msg?.quoted?.sender ?? msg.chat ?? msg.sender);
	},
} satisfies CommandModule;
