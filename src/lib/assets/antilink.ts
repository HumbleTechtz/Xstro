import { AntilinkDb } from "../schema/index.ts";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default [
	{
		pattern: "antilink",
		fromMe: false,
		isGroup: true,
		desc: "Setup Antilink for Group Chat",
		type: "group",
		handler: async (msg, args) => {
			const usage = [
				"Usage:",
				"antilink on",
				"antilink off",
				"antilink mode kick | delete",
				"antilink set chat.whatsapp.com,google.com",
			].join("\n");

			if (!args) return msg.send(usage);

			const [cmd, ...rest] = args.toLowerCase().trim().split(" ");

			if (cmd === "on") {
				await AntilinkDb.set(msg.chat, true);
				return msg.send(en.plugin.antilink.enabled);
			}

			if (cmd === "off") {
				await AntilinkDb.remove(msg.chat);
				return msg.send(en.plugin.antilink.disabled);
			}

			if (cmd === "mode") {
				if (rest[0] !== "kick" && rest[0] !== "delete") {
					return msg.send(
						["Usage:,antilink mode kick OR, antilink mode delete"].join("\n")
					);
				}
				await AntilinkDb.set(msg.chat, rest[0] === "kick" ? true : false);
				return msg.send(`_Antilink mode is now set to ${rest[0]} participant_`);
			}

			if (cmd === "set") {
				if (!rest.length) return msg.send(en.plugin.antilink.need_links);
				await AntilinkDb.set(msg.chat, true, rest);
				return msg.send(`_Antilink set to handle ${rest.length} links_`);
			}

			return msg.send(usage);
		},
	},
	{
		on: true,
		dontAddCommandList: true,
		handler: async msg => {
			if (!msg.isGroup || !msg.text || msg.key.fromMe) return;
			if (msg.isAdmin || !msg.isBotAdmin) return;

			const antilink = await AntilinkDb.get(msg.chat);
			if (!antilink) return;

			const text = msg.text.toLowerCase();
			const hasLink =
				antilink.links?.some(link => text.includes(link.toLowerCase())) ||
				/https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?/i.test(text);

			if (!hasLink) return;

			await msg.delete(msg);

			if (antilink.mode === true) {
				await msg.groupParticipantsUpdate(msg.chat, [msg.sender!], "remove");
				await msg.send(`@${msg.sender.split("@")[0]} removed for sending link`, {
					mentions: [msg.sender],
					to: msg.chat,
				});
			} else {
				await msg.send(en.plugin.antilink.link_warning);
			}
		},
	},
] satisfies CommandModule[];
