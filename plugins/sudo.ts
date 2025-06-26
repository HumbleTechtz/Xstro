import { Command } from "../client/Core";
import { SetSudo, delSudo, getSudo, isSudo } from "../client/Models";
import language from "../client/Utils/language";

Command({
	name: "setsudo",
	fromMe: true,
	isGroup: false,
	desc: "Sudo a user",
	type: "settings",
	function: async (msg, args) => {
		const user = await msg.userId(args);
		if (!user) return msg.send(language.PROVIDE_USER);

		const { jid, lid } = await msg.userInfo(user);
		if (!jid || !lid) return msg.send(language.JID_LID_FAIL);

		if (isSudo(jid)) return msg.send(language.CMD.SUDO.EXISTS);
		SetSudo(jid, lid);
		return msg.send(language.CMD.SUDO.UPDATED);
	},
});

Command({
	name: "delsudo",
	fromMe: true,
	isGroup: false,
	desc: "Remove sudo user",
	type: "settings",
	function: async (msg, args) => {
		const user = await msg.userId(args);
		if (!user) return msg.send(language.PROVIDE_USER);

		const { jid } = await msg.userInfo(user);
		if (!jid) return msg.send(language.JID_LID_FAIL);

		if (!isSudo(jid)) return msg.send(language.CMD.SUDO.NOT_SUDO);
		delSudo(jid);
		return msg.send(language.CMD.SUDO.REMOVED);
	},
});

Command({
	name: "getsudo",
	fromMe: true,
	isGroup: false,
	desc: "List sudo users",
	type: "settings",
	function: async msg => {
		const sudo = getSudo("jid");
		if (!sudo.length) return msg.send(language.CMD.SUDO.NAN);

		const users = sudo.map(j => `@${j.split("@")[0]}`).join("\n");
		return msg.send(`${users}`, { mentions: sudo });
	},
});
