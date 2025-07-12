import { CommandModule } from "@types";
import { delay } from "baileys";
import { en } from "lib/resources";
import { setprefix } from "lib/schema";

export default {
	pattern: "setprefix",
	fromMe: true,
	isGroup: false,
	desc: "Set custom handler",
	type: "settings",
	handler: async (msg, args) => {
		console.log(`Arguments:`, args);
		args = args ?? null;
		if (!args) msg.send(en.plugin.settings.prefix.tutorial), await delay(500);
		setprefix(args);
		return msg.send(`prefix set to ${!args ? "empty" : args}`);
	},
} satisfies CommandModule;
