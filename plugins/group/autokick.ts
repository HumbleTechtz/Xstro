import lang from "../../core/Utils/language";
import { addAutoKick, delAutoKick, getAllAutoKicks } from "../../core/Models";
import type { CommandModule } from "../../core/Core";

export default {
	pattern: "autokick",
	fromMe: true,
	isGroup: true,
	desc: "Manage autokick list (add, del, list)",
	type: "group",
	run: async (msg, args) => {
		if (!msg.isAdmin) return msg.send(lang.BOT_NOT_ADMIN);
		if (!msg.isBotAdmin) return msg.send(lang.BOT_NOT_ADMIN);
		if (!args) {
			return msg.send(`Usage: ${msg.prefix[0]}autokick <add|del|list> <user?>`);
		}

		const [subcmd, ...rest] = args.split(" ");
		const groupJid = msg.chat;

		if (subcmd === "list") {
			const allEntries = getAllAutoKicks();
			const entry = allEntries.find(e => e.groupJid === groupJid);

			if (!entry || (!entry.jid && !entry.lid)) {
				return msg.send("_No users in autokick list._");
			}

			const list = [entry.jid, entry.lid].filter(Boolean) as string[];
			const formatted = list.map(u => `@${u.split("@")[0]}`).join("\n");

			return msg.send(`Autokick list:\n${formatted}`, { mentions: list });
		}

		const rawUser = rest.join(" ");
		const parsedUser = await msg.userId(rawUser);
		if (!parsedUser) return msg.send("_Invalid user provided_");

		const { jid, lid, exists } = await msg
			.onWhatsApp(parsedUser)
			.then(v => v![0]);
		if (!exists) return msg.send("_User does not exist on WhatsApp_");

		if (subcmd === "add") {
			const j = jid ?? null;
			const l = (lid as string) ?? null;
			addAutoKick(groupJid, j, l);
			return msg.send(`_@${parsedUser.split("@")[0]} added to autokick list_`, {
				mentions: [parsedUser],
			});
		}

		if (subcmd === "del") {
			delAutoKick(groupJid);
			return msg.send(`_Autokick entry for group ${groupJid} removed_`);
		}

		return msg.send("_Use `add`, `del`, or `list`._");
	},
} satisfies CommandModule;
