import { Command } from "../../src/Core/plugin.ts";
import { SetSudo, delSudo, getSudo, isSudo } from "../../src/Models/index.ts";

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

		const userToSudo = await msg.parseId(args);
		if (!userToSudo) return msg.send(`_User is invalid_`);

		if (await isSudo(userToSudo)) return msg.send("_Already a sudo user_");

		const userInfo = await msg.onWhatsApp(userToSudo).then(m => m?.[0]);
		if (!userInfo) return msg.send(`_User not found on WhatsApp_`);

		const { jid, lid } = userInfo;
		await SetSudo(jid, lid as string);
		return msg.send(`_Sudo list updated_`);
	},
});

Command({
	name: "delsudo",
	fromMe: true,
	isGroup: false,
	desc: "Remove a sudo user",
	type: "settings",
	function: async (msg, args) => {
		if (!args) return msg.send(`_Provide number to remove from sudo_`);

		const user = await msg.parseId(args);
		if (!user) return msg.send(`_Provided User is invalid_`);

		if (!(await isSudo(user))) {
			return msg.send("_This user is not in the sudo list._");
		}

		await delSudo(user);
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
		const sudoList = await getSudo("jid");
		if (!sudoList.length) return msg.send("_No sudo users found._");

		const formattedList = sudoList
			.map(user => `@${user.split("@")[0]}`)
			.join("\n");
		return msg.send(`Sudo users:\n${formattedList}`, { mentions: sudoList });
	},
});
