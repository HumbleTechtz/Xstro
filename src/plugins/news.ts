import { Command } from '../messaging/plugins.ts';
import { voxnews, wabetanews, technews } from '@astrox11/utily';

Command({
	name: 'news',
	fromMe: false,
	isGroup: false,
	desc: 'Get News from Vox',
	type: 'news',
	function: async message => {
		const news = await voxnews();
		if (!news) return message.send('_No news avaliable_');
		return await message.send(news);
	},
});

Command({
	name: 'wabeta',
	fromMe: false,
	isGroup: false,
	desc: 'Get WABeta News',
	type: 'news',
	function: async message => {
		const wabetaInfo = await wabetanews();
		if (!wabetaInfo) return message.send('_No WA updates avaliable_');
		return await message.send(wabetaInfo);
	},
});

Command({
	name: 'technews',
	fromMe: false,
	isGroup: false,
	desc: 'Get Tech News',
	type: 'news',
	function: async message => {
		const techInfo = await technews();
		if (!techInfo) return message.send('_No tech news updates!_');
		return await message.send(techInfo);
	},
});
