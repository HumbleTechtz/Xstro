import { openAsBlob } from "node:fs";
import language from "../client/Utils/language";
import { removeBg } from "../client/Utils";
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
	{
		pattern: "rmbg",
		fromMe: false,
		isGroup: false,
		desc: "Remove a background from an image",
		type: "tools",
		run: async msg => {
			const m = msg.quoted;
			if (!m || !m.image) return msg.send("Reply an image");

			const blob = await openAsBlob(
				await msg.download({ message: m, save: true })
			);
			return await msg.send(Buffer.from(await removeBg(blob)));
		},
	},
] satisfies CommandModule[];
