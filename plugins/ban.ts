import { Command } from "../client/Core";
import { delBan, getBan, setBan, isBanned } from "../client/Models";
import language from "../client/Utils/language";

Command({
	name: "ban",
	fromMe: true,
	isGroup: false,
	desc: "Ban a user from using the bot",
	type: "settings",
	function: async (msg, args) => {
		const user = await msg.userId(args);
		if (!user) return msg.send(language.PROVIDE_USER);

		const { jid, lid } = await msg.userInfo(user);
		if (!jid || !lid) return msg.send(language.JID_LID_FAIL);

		if (isBanned(jid)) return msg.send(language.CMD.BAN.ALREADY_BANNED);
		setBan(jid, lid);
		return msg.send(language.CMD.BAN.BANNED);
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
		if (!user) return msg.send(language.PROVIDE_USER);

		const { jid } = await msg.userInfo(user);
		if (!jid) return msg.send(language.JID_LID_FAIL);

		if (!isBanned(jid)) return msg.send(language.CMD.BAN.NOT_BANNED);
		delBan(jid);
		return msg.send(language.CMD.BAN.UNBANNED);
	},
});

Command({
	name: "getban",
	fromMe: true,
	isGroup: false,
	desc: "List banned users",
	type: "settings",
	function: async msg => {
		const banned = getBan("jid");
		if (!banned.length) return msg.send(language.CMD.BAN.NAN);

		const users = banned.map(j => `@${j.split("@")[0]}`).join("\n");
		return msg.send(`${users}`, { mentions: banned });
	},
});
