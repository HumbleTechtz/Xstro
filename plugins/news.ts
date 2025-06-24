import { Command } from "../client/Core";
import { getAPNews, getTradeNews, getWABeta } from "../client/Utils";

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

Command({
	name: "wabeta",
	fromMe: false,
	isGroup: false,
	desc: "Get news from WABeta",
	type: "news",
	function: async message => {
		const news = await getWABeta();
		return await message.send(news);
	},
});

Command({
	name: "forex",
	fromMe: false,
	isGroup: false,
	desc: "Get techincal forex info",
	type: "news",
	function: async message => {
		const news = await getTradeNews();
		return await message.send(news);
	},
});
