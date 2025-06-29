import { createMeme } from "../client/Media";
import type { CommandModule } from "../client/Core";

const makers = [
	"elon",
	"andrew",
	"messi",
	"obama",
	"ronaldo",
	"trump",
] as const;

export default makers.map(name => ({
	pattern: name,
	fromMe: false,
	isGroup: false,
	desc: `Create a fake ${name} tweet`,
	type: "maker",
	run: async (msg, args) => {
		if (!args) return msg.send("Type something");
		return msg.send(await createMeme(args, name));
	},
})) satisfies CommandModule[];
