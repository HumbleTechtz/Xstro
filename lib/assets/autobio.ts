import type { CommandModule } from "@types";
import { getFormattedBio } from "lib";

export default {
	pattern: "autobio",
	fromMe: true,
	desc: "Update bot bio with a random coding quote",
	type: "misc",
	handler: async msg => {
		const newBio = getFormattedBio();
		await msg.updateProfileStatus(newBio);
	},
} satisfies CommandModule;
