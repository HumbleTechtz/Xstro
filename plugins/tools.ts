import { Command } from "../src/Core/plugin.ts";
import { fetch, isUrl, urlBuffer, upload, logo } from "../src/Utils/index.ts";

Command({
	name: "url",
	fromMe: false,
	isGroup: false,
	desc: "Shorten a url",
	type: "tools",
	function: async (message, match) => {
		if (!match || !isUrl(match))
			return message.send("Provide a url to shorten");
		const url = await fetch(`https://tinyurl.com/api-create.php?url=${match}`);
		return await message.send(url);
	},
});

Command({
	name: "getpp",
	fromMe: false,
	isGroup: false,
	desc: "Get the profile picture of any person or group",
	type: "tools",
	function: async (message, match) => {
		const user = await message.parseId(match);
		if (!user) return message.send("Provide someone number");
		let profilePic;
		try {
			profilePic = await message.profilePictureUrl(user, "image");
			if (!profilePic)
				return message.send(
					"User has no profile picture, or maybe their settings is prevent the bot from seeing it."
				);
		} catch {
			return message.send(
				`_Unable to get Profile Picture, this may be that the user doesn't have one or their settings blocks the bot from accessing it, the user may be required to save your contact in order to extract their profile picture_`
			);
		}
		return await message.send(await urlBuffer(profilePic));
	},
});

Command({
	name: "repo",
	fromMe: false,
	isGroup: false,
	desc: "Get the url to the bot source code",
	type: "group",
	function: async m => {
		return await m.send(
			`You can find the source code of this bot at: https://github.com/AstroXTeam/whatsapp-bot`
		);
	},
});
