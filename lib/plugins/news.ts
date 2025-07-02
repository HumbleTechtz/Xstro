import { getAPNews, getWABeta, getTradeNews } from "../common";
import type { CommandModule } from "../client";

export default [
	{
		pattern: "news",
		fromMe: false,
		isGroup: false,
		desc: "Get News from Associated Press",
		type: "news",
		run: async message => {
			const news = await getAPNews();
			return message.send(news);
		},
	},
	{
		pattern: "wabeta",
		fromMe: false,
		isGroup: false,
		desc: "Get news from WABeta",
		type: "news",
		run: async message => {
			const news = await getWABeta();
			return message.send(news);
		},
	},
	{
		pattern: "forex",
		fromMe: false,
		isGroup: false,
		desc: "Get techincal forex info",
		type: "news",
		run: async message => {
			const news = await getTradeNews();
			return message.send(news);
		},
	},
] satisfies CommandModule[];
