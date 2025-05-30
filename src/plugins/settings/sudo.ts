import { Command } from "../../messaging/plugin.ts";
import { delsudo, getSudo, setSudo } from "../../models/settings.ts";

Command({
	name: "setsudo",
	fromMe: true,
	isGroup: false,
	desc: "Sudo a user",
	type: "settings",
	function: async (msg, args) => {
		if (!args) return msg.send("_Provide number to sudo_");
		if (msg.isGroup)
			return msg.send(
				`_${msg.sender.split("@")[0]} You cannot sudo inside a Group, Please this command should be used in Personal Chats_`,
			);
		const sudoList = await getSudo();
		const userToSudo = await msg.parseId(args);
		if (!userToSudo) return msg.send(`_User is invaild_`);
		if (sudoList.includes(userToSudo)) return msg.send("_Already a sudo user_");
		const { jid, lid } = await msg.onWhatsApp(userToSudo).then(m => m![0]);
		await setSudo([jid, lid as string]);
		return await msg.send(`_Sudo list Updated_`);
	},
});

Command({
	name: "delsudo",
	fromMe: true,
	isGroup: false,
	desc: "Remove a sudo user",
	type: "settings",
	function: async (msg, args) => {
		const user = await msg.parseId(args);
		if (!user) return msg.send(`_Provided User is Invalid_`);
		const settings = await getSudo();
		if (!settings.includes(user)) {
			return msg.send("_This user is not in the sudo list._");
		}
		const { jid, lid } = await msg.onWhatsApp(user).then(m => m![0]);
		await delsudo([jid, lid as string]);
		return msg.send(`_@${user.split("@")[0]} removed from sudo_`, {
			mentions: [user],
		});
	},
});

Command({
	name: "getsudo",
	fromMe: true,
	isGroup: false,
	desc: "Get list of sudo users",
	type: "settings",
	function: async msg => {
		const settings = await getSudo();
		if (!settings.length) return msg.send("_No sudo users found._");

		const sudoList = settings.map(user => `@${user.split("@")[0]}`).join("\n");
		return msg.send(`Sudo users:\n${sudoList}`, { mentions: settings });
	},
});
