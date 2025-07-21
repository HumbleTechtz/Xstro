import { AutoBioDb } from "../schema/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default {
	pattern: "autobio",
	fromMe: true,
	desc: "Toggle autobio on/off",
	type: "misc",
	handler: async msg => {
		const current = AutoBioDb.get();
		const next = current ? 0 : 1;
		AutoBioDb.set(next);

		await msg.send(`_Autobio is now ${next === 1 ? "on" : "off"}_`);
	},
} satisfies CommandModule;
