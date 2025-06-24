import { Command } from "../client/Core";
import { getAPNews } from "../client/Utils";

Command({
	name: "news",
	fromMe: false,
	isGroup: false,
	desc: "Get News from Associated Press",
	type: "news",
	function: async message => {
		const news = await getAPNews();
		return await message.send(news);
	},
});
