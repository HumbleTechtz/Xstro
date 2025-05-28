import { Command } from "../messaging/plugin.ts";
import { getSettings, setSettings } from "../models/settings.ts";

Command({
	name: "setsudo",
	fromMe: true,
	isGroup: false,
	desc: "Sudo a user",
	type: "settings",
	function: async (msg, args) => {
		const user = msg.user(args);
		if (!user) return msg.send("_Reply, mention or provide a number to sudo_");
		const isSudo = await getSettings();
		if (isSudo.sudo.includes(user)) {
			return msg.send("_Already a sudo user!_");
		}
		const users = Array.from(new Set([user, ...isSudo.sudo]));
		await setSettings("sudo", users);
		return await msg.send(`_@${user.split("@")[0]} is now sudo_`, {
			mentions: [user],
		});
	},
});

Command({
	name: "delsudo",
	fromMe: true,
	isGroup: false,
	desc: "Remove a sudo user",
	type: "settings",
	function: async (msg, args) => {
		const user = msg.user(args);
		if (!user)
			return msg.send("_Reply, mention or provide a number to remove from sudo_");

		const settings = await getSettings();
		if (!settings.sudo.includes(user)) {
			return msg.send("_This user is not in the sudo list._");
		}

		const updated = settings.sudo.filter(u => u !== user);
		await setSettings("sudo", updated);
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
		const settings = await getSettings();
		if (!settings.sudo.length) return msg.send("_No sudo users found._");

		const sudoList = settings.sudo
			.map(user => `@${user.split("@")[0]}`)
			.join("\n");
		return msg.send(`Sudo users:\n${sudoList}`, { mentions: settings.sudo });
	},
});
