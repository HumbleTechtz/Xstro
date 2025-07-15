import { CommandModule } from "@types";

export default [
	{
		pattern: "jid",
		aliases: ["lid"],
		fromMe: true,
		desc: "fetch Jid/Lid",
		type: "debug",
		handler: msg => {
			return msg.send(msg?.quoted?.sender ?? msg.chat ?? msg.sender);
		},
	},
] satisfies CommandModule[];
