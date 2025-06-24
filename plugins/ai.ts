import { Command } from "../client/Core";
import { chatAi } from "../client/Utils";

Command({
	name: "ai",
	fromMe: false,
	isGroup: false,
	desc: "Chat with Ai",
	type: "ai",
	function: async (msg, args) => {
		args = args ?? msg.quoted?.text!;
		if (!args) return msg.send(`_${msg.pushName} hello_`);
		const response = await chatAi(args);
		return await msg.send(response);
	},
});
