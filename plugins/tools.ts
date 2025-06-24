import { Command } from "../client/Core";

Command({
	name: "repo",
	fromMe: false,
	isGroup: false,
	desc: "Get the url to the bot source code",
	type: "tools",
	function: async message => {
		return await message.send(`https://github.com/AstroX11/whatsapp-bot`);
	},
});

Command({
	name: "getpp",
	fromMe: true,
	isGroup: false,
	desc: "Get Profile Photo",
	type: "tools",
	function: async (message, args) => {
		const user = await message.userId(args);
		if (!user) return message.send(`_Provide a number_`);
		const pp = await message.profilePictureUrl(user, "image");
		if (!pp) return message.send(`_No profile photo found_`);
		return await message.send(pp);
	},
});
