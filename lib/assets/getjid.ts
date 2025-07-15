import { CommandModule } from "@types";

export default [
	{
		pattern: "jid",
		aliases: ["lid"],
		fromMe: true,
		desc: "fetch Jid/Lid",
		type: "debug",
		handler: msg => {
			return msg.send(
				`🆔 Chat JID: ${msg.chat || msg.sender || "❌ Chat JID not found"}`
			);
		},
	},
] satisfies CommandModule[];
