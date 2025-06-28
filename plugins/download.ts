import { Command } from "../client/Core";
import { extractUrl, Pinterest } from "../client/Utils";

Command({
	name: "pinterest",
	fromMe: false,
	isGroup: false,
	desc: "Download Pinterest Media",
	type: "download",
	function: async (msg, args) => {
		const url = extractUrl((args ?? msg.quoted?.text)?.trim());
		if (!url || !/^https?:\/\/(www\.)?pin\.it\/\w+/i.test(url)) {
			return void msg.send("_Provide a valid Pinterest URL._");
		}
		const res = await Pinterest(url);
		if (!res) return msg.send("_Failed to download_");
		return await msg.send(res);
	},
});
