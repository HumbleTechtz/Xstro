import { delAntilink, getAntilink, setAntilink } from "../../lib/schemas";
import type { CommandModule } from "../../lib/client/";

export default [
	{
		pattern: "antilink",
		fromMe: false,
		isGroup: true,
		desc: "Setup Antilink for Group Chat",
		type: "group",
		run: async (msg, args) => {
			const { prefix } = msg;
			if (!args) {
				return await msg.send(
					`\`\`\`
Usage: 
${prefix}antilink on
${prefix}antilink off
${prefix}antlink mode kick | delete
${prefix}antilink set chat.whatsapp.com,google.com\`\`\``
				);
			}

			args = args.toLowerCase().trim();
			const choice = args.split(" ");
			if (choice[0] === "on") {
				setAntilink(msg.chat, true);
				return await msg.send("_Antilink turned on_");
			}
			if (choice[0] === "off") {
				delAntilink(msg.chat);
				return await msg.send("_Antilink turned off_");
			}

			if (choice[0] === "mode") {
				if (choice[1] !== "kick" && choice[1] !== "delete")
					return await msg.send(
						`\`\`\`Usage:\n${prefix}antilink mode kick\nOR\n${prefix}antilink mode delete\`\`\``
					);
				setAntilink(msg.chat, choice[1] === "kick" ? true : false);
				return await msg.send(
					"_Antilink mode is now set to " + choice[1] + " participant_"
				);
			}

			if (choice[0] === "set") {
				if (!choice?.[1])
					return await msg.send("_You need to add some specific links to prohibit_");
				setAntilink(msg.chat, true, choice.slice(1));
				return await msg.send(
					`_Antilink set to handle ${choice.slice(1).length} links_`
				);
			}
		},
	},
	{
		on: true,
		dontAddCommandList: true,
		run: async msg => {
			if (!msg.isGroup || !msg?.text) return;
			if (msg.key.fromMe || msg.sudo) return;
			if (msg.isAdmin || !msg.isBotAdmin) return;

			const antilink = getAntilink(msg.chat);
			if (!antilink) return;

			const text = msg.text.toLowerCase();
			let hasProhibitedLink = false;

			if (antilink.links?.length) {
				hasProhibitedLink = antilink.links.some((link: string) =>
					text.includes(link.toLowerCase())
				);
			} else {
				hasProhibitedLink =
					/https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?/i.test(text);
			}

			if (!hasProhibitedLink) return;

			await msg.delete(msg);

			if (antilink.mode === true) {
				await msg.groupParticipantsUpdate(msg.chat, [msg.sender!], "remove");
				await msg.send(`@${msg.sender.split("@")[0]} removed for sending link`, {
					mentions: [msg.sender!],
				});
			} else {
				await msg.send("_Links are not allowed here_");
			}
		},
	},
] satisfies CommandModule[];
