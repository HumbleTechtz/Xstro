import { Command } from "../client/Core";
import { SetSudo, delSudo, getSudo, isSudo } from "../client/Models";

const validateUser = async (msg: any, args?: string) => {
	if (!args) return { error: "_Provide number_" };

	const userId = await msg.userId(args);
	if (!userId) return { error: "_Invalid user_" };

	return { userId };
};

const ensurePersonalChat = (msg: any) =>
	msg.isGroup ? "_Use in personal chats only_" : null;

Command({
	name: "setsudo",
	fromMe: true,
	isGroup: false,
	desc: "Sudo a user",
	type: "settings",
	function: async (msg, args) => {
		const groupError = ensurePersonalChat(msg);
		if (groupError) return msg.send(groupError);

		const { error, userId } = await validateUser(msg, args);
		if (error) return msg.send(error);

		if (await isSudo(userId)) return msg.send("_Already sudo user_");

		const userInfo = await msg.onWhatsApp(userId).then(m => m?.[0]);
		if (!userInfo) return msg.send("_User not on WhatsApp_");

		await SetSudo(userInfo.jid, userInfo.lid as string);
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
		const { error, userId } = await validateUser(msg, args);
		if (error) return msg.send(error.replace("number", "number to remove"));

		if (!(await isSudo(userId))) return msg.send("_Not a sudo user_");

		await delSudo(userId);
		return msg.send(`_@${userId.split("@")[0]} removed from sudo_`, {
			mentions: [userId],
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

		const mentions = sudoList.map(user => `@${user.split("@")[0]}`).join("\n");
		return msg.send(`Sudo users:\n${mentions}`, { mentions: sudoList });
	},
});
