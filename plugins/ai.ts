import { chatAi } from "../core/Utils";
import type { CommandModule } from "../core/Core";

export default {
	pattern: "ai",
	desc: "Chat with Ai",
	type: "ai",
	fromMe: false,
	isGroup: false,
	run: async (msg, args) => {
		args = args ?? msg.quoted?.text!;
		if (!args) return msg.send(`_${msg.pushName} hello_`);
		return msg.send(await chatAi(args));
	},
} satisfies CommandModule;
