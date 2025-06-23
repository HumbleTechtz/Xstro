import { Command } from "../../client/Core";
import { delBan, getBan, setBan } from "../../client/Models";

Command({
	name: "ban",
	fromMe: true,
	isGroup: false,
	desc: "Ban a user from using the bot",
	type: "settings",
	function: async (msg, args) => {
		if (!args) return msg.send("_Provide number to ban_");

		const bannedList = await getBan();
		const userToBan = await msg.userId(args);
		if (!userToBan) return msg.send(`_Invalid user_`);
		if (bannedList.includes(userToBan))
			return msg.send("_User is already banned_");

		const { jid, lid } = await msg.onWhatsApp(userToBan).then(m => m![0]);
		await setBan(jid, lid as string);
		return await msg.send(`_User banned from using the bot_`);
	},
});

Command({
	name: "unban",
	fromMe: true,
	isGroup: false,
	desc: "Unban a user",
	type: "settings",
	function: async (msg, args) => {
		const user = await msg.userId(args);
		if (!user) return msg.send(`_Provided User is Invalid_`);
		const banned = await getBan();
		if (!banned.includes(user)) {
			return msg.send("_This user is not banned._");
		}
		await delBan(user);
		return msg.send(`_@${user.split("@")[0]} has been unbanned_`, {
			mentions: [user],
		});
	},
});

Command({
	name: "getban",
	fromMe: true,
	isGroup: false,
	desc: "List banned users",
	type: "settings",
	function: async msg => {
		const list = await getBan();
		if (!list.length) return msg.send("_No banned users found._");

		const bannedList = list.map(user => `@${user.split("@")[0]}`).join("\n");
		return msg.send(`Banned users:\n${bannedList}`, { mentions: list });
	},
});
