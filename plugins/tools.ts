import { Command } from "../client/Core";

Command({
	name: "repo",
	fromMe: false,
	isGroup: false,
	desc: "Get the url to the bot source code",
	type: "group",
	function: async m => {
		return await m.send(`https://github.com/AstroX11/whatsapp-bot`);
	},
});
