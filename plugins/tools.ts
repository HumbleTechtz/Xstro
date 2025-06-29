import language from "../client/Utils/language";
import type { CommandModule } from "../client/Core";

export default [
	{
		pattern: "repo",
		fromMe: false,
		isGroup: false,
		desc: "Get the url to the bot source code",
		type: "tools",
		run: async message => {
			return await message.send(language.REPO_URL);
		},
	},
	{
		pattern: "getpp",
		fromMe: true,
		isGroup: false,
		desc: "Get Profile Photo",
		type: "tools",
		run: async (message, args) => {
			const user = await message.userId(args);
			if (!user) return message.send(`_Provide a number_`);
			const pp = await message.profilePictureUrl(user, "image");
			if (!pp) return message.send(`_No profile photo found_`);
			return await message.send(pp);
		},
	},
] satisfies CommandModule[];
