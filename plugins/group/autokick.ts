import { Command } from "../../src/Core/plugin.ts";
import {
	addAutoKick,
	delAutoKick,
	getAutoKick,
} from "../../src/Models/index.ts";

Command({
	name: "autokick",
	fromMe: true,
	isGroup: true,
	desc: "Manage autokick list (add, del, list)",
	type: "group",
	function: async (msg, args) => {
		if (!args) {
			return msg.send(`Usage: ${msg.prefix[0]}autokick <add|del|list> <user?>`);
		}

		const [subcmd, ...rest] = args.split(" ");
		const groupJid = msg.jid;

		if (subcmd === "list") {
			const list = await getAutoKick(groupJid);
			if (!list.length) return msg.send("_No users in autokick list._");

			const formatted = list.map(u => `@${u.split("@")[0]}`).join("\n");
			return msg.send(`Autokick list:\n${formatted}`, { mentions: list });
		}

		const rawUser = rest.join(" ");
		const parsedUser = await msg.parseId(rawUser);
		if (!parsedUser) return msg.send("_Invalid user provided_");

		const { jid, lid, exists } = await msg
			.onWhatsApp(parsedUser)
			.then(v => v![0]);
		if (!exists) return msg.send("_User does not exist on WhatsApp_");

		if (subcmd === "add") {
			await addAutoKick(groupJid, jid, lid as string, [jid]);
			return msg.send(`_@${jid.split("@")[0]} added to autokick list_`, {
				mentions: [jid],
			});
		}

		if (subcmd === "del") {
			await delAutoKick(groupJid, [jid]);
			return msg.send(`_@${jid.split("@")[0]} removed from autokick list_`, {
				mentions: [jid],
			});
		}

		return msg.send("_Use `add`, `del`, or `list`._");
	},
});
