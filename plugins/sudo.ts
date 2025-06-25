import { Command } from "../client/Core";
import { SetSudo, delSudo, getSudo, isSudo } from "../client/Models";

Command({
	name: "setsudo",
	fromMe: true,
	isGroup: false,
	desc: "Sudo a user",
	type: "settings",
	function: async (msg, args) => {
		const user = await msg.userId(args);
		if (!user) return msg.send(`_Provide number_`);

		const coId = await msg.getCoId(user);
		if (!coId || !coId.jid || !coId.lid) {
			return msg.send("_Could not get user JID or LID_");
		}
		const { jid, lid } = coId;

		if (await isSudo(jid)) return msg.send("_Already sudo user_");

		await SetSudo(jid, lid);
		return msg.send("_Sudo updated_");
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
		if (!user) return msg.send(`_Provide number_`);

		const coId = await msg.getCoId(user);
		if (!coId || !coId.jid) return msg.send("_Could not get user JID_");

		const { jid } = coId;

		if (!(await isSudo(jid))) return msg.send("_Not a sudo user_");

		await delSudo(jid);
		return msg.send(`_@${user.split("@")[0]} removed from sudo_`, {
			mentions: [jid],
		});
	},
});

Command({
	name: "getsudo",
	fromMe: true,
	isGroup: false,
	desc: "List sudo users",
	type: "settings",
	function: async msg => {
		const sudoList = await getSudo("jid");
		if (!sudoList.length) return msg.send("_No sudo users_");

		const mentions = sudoList.map(j => `@${j.split("@")[0]}`).join("\n");
		return msg.send(`Sudo users:\n${mentions}`, { mentions: sudoList });
	},
});
