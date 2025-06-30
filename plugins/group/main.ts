import lang from "../../core/Utils/language";
import { cachedGroupMetadata } from "../../core/Models";
import type { CommandModule } from "../../core/Core";

export default [
	{
		pattern: "add",
		fromMe: true,
		isGroup: true,
		desc: "Add participant to group",
		type: "group",
		run: async (message, match) => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);

			const user = `${match}@s.whatsapp.net`;
			if (!(await message.onWhatsApp(user))) {
				return message.send("_Invalid number_");
			}
			await message.groupParticipantsUpdate(message.chat, [user], "add");
			message.send(`_@${user.split("@")[0]} added to group_`, {
				mentions: [user],
			});
		},
	},
	{
		pattern: "kick",
		fromMe: false,
		isGroup: true,
		desc: "Remove participant from group",
		type: "group",
		run: async (message, match) => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);

			const user = await message.userId(match);
			if (!user) return message.send("_Invalid number or mention_");
			await message.groupParticipantsUpdate(message.chat, [user], "remove");
			message.send(`_@${user.split("@")[0]} kicked from group_`, {
				mentions: [user],
			});
		},
	},
	{
		pattern: "kickall",
		fromMe: true,
		isGroup: true,
		desc: "Kickall all participants from a Group",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const groupData = cachedGroupMetadata(message.chat);
			const participants = groupData.participants
				.filter(p => !p.admin)
				.map(p => p.id);

			await message.groupParticipantsUpdate(message.chat, participants, "remove");
		},
	},
	{
		pattern: "promote",
		fromMe: false,
		isGroup: true,
		desc: "Promote participant to admin",
		type: "group",
		run: async (message, match) => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);

			const user = await message.userId(match);
			if (!user) return message.send("_Invalid number or mention_");
			const groupData = cachedGroupMetadata(message.chat);
			const admins = groupData.participants.filter(v => v.admin).map(v => v.id);
			if (admins.includes(user)) {
				return message.send(`_@${user.split("@")[0]} is already admin_`, {
					mentions: [user],
				});
			}
			await message.groupParticipantsUpdate(message.chat, [user], "promote");
			return await message.send(`_@${user.split("@")[0]} is now admin_`, {
				mentions: [user],
			});
		},
	},
	{
		pattern: "demote",
		fromMe: false,
		isGroup: true,
		desc: "Demote admin to participant",
		type: "group",
		run: async (message, match) => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);

			const user = await message.userId(match);
			if (!user) return message.send("_Invalid number or mention_");
			const groupData = cachedGroupMetadata(message.chat);
			const admins = groupData.participants.filter(v => v.admin).map(v => v.id);
			if (!admins.includes(user)) {
				return message.send(`_@${user.split("@")[0]} is not admin_`, {
					mentions: [user],
				});
			}
			await message.groupParticipantsUpdate(message.chat, [user], "demote");
			return await message.send(`_@${user.split("@")[0]} is no longer admin_`, {
				mentions: [user],
			});
		},
	},
	{
		pattern: "newgc",
		fromMe: true,
		isGroup: false,
		desc: "Create new group",
		type: "group",
		run: async (message, match) => {
			if (!match) return message.send("_Provide group name_");
			const gc = await message.groupCreate(match, [message.owner.jid]);
			const invite = await message.groupInviteCode(gc.id);
			const url = `https://chat.whatsapp.com/${invite}`;
			return await message.send(url, {
				contextInfo: {
					isForwarded: true,
					externalAdReply: {
						title: match,
						body: `Join ${match}`,
						sourceUrl: url,
						showAdAttribution: true,
					},
				},
			});
		},
	},
	{
		pattern: "tag",
		fromMe: false,
		isGroup: true,
		desc: "Mention entire group",
		type: "group",
		run: async (message, match) => {
			const { participants } = cachedGroupMetadata(message.chat);
			return await message.relayMessage(
				message.chat,
				{
					extendedTextMessage: {
						text: `@${message.chat} ${match ?? ""}`,
						contextInfo: {
							mentionedJid: participants.filter(p => p.id).map(p => p.id),
							groupMentions: [{ groupJid: message.chat, groupSubject: "everyone" }],
						},
					},
				},
				{}
			);
		},
	},
	{
		pattern: "gname",
		fromMe: false,
		isGroup: true,
		desc: "Update group pattern",
		type: "group",
		run: async (message, match) => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!match) return message.send("_Provide new group name_");
			await message.groupUpdateSubject(message.chat, match);
			return await message.send("_Group pattern updated_");
		},
	},
	{
		pattern: "gdesc",
		fromMe: false,
		isGroup: true,
		desc: "Update group description",
		type: "group",
		run: async (message, match) => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!match) return message.send("_Provide new group description_");
			await message.groupUpdateDescription(message.chat, match);
			return await message.send("_Group description updated_");
		},
	},
	{
		pattern: "mute",
		fromMe: false,
		isGroup: true,
		desc: "Allow only admins to send messages",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const metadata = cachedGroupMetadata(message.chat);
			if (metadata.announce) return message.send("_Group already muted_");
			await message.groupSettingUpdate(message.chat, "announcement");
			return await message.send("_Group muted, only admins can send messages_");
		},
	},
	{
		pattern: "unmute",
		fromMe: false,
		isGroup: true,
		desc: "Allow all members to send messages",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const metadata = cachedGroupMetadata(message.chat);
			if (!metadata.announce) return message.send("_Group already unmuted_");
			await message.groupSettingUpdate(message.chat, "not_announcement");
			return await message.send("_Group unmuted, all members can send messages_");
		},
	},
	{
		pattern: "lock",
		fromMe: false,
		isGroup: true,
		desc: "Restrict settings to admins",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const metadata = cachedGroupMetadata(message.chat);
			if (metadata.restrict)
				return message.send("_Group settings already restricted_");
			await message.groupSettingUpdate(message.chat, "locked");
			return await message.send("_Group settings restricted to admins_");
		},
	},
	{
		pattern: "unlock",
		fromMe: false,
		isGroup: true,
		desc: "Allow all members to manage settings",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const metadata = cachedGroupMetadata(message.chat);
			if (!metadata.restrict)
				return message.send("_Group settings already unrestricted_");
			await message.groupSettingUpdate(message.chat, "unlocked");
			return await message.send("_Group settings unrestricted_");
		},
	},
	{
		pattern: "invite",
		fromMe: false,
		isGroup: true,
		desc: "Get group invite link",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const code = await message.groupInviteCode(message.chat);
			return await message.send(`_https://chat.whatsapp.com/${code}_`);
		},
	},
	{
		pattern: "revoke",
		fromMe: false,
		isGroup: true,
		desc: "Revoke group invite code",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const code = await message.groupRevokeInvite(message.chat);
			return await message.send(`_https://chat.whatsapp.com/${code}_`);
		},
	},
	{
		pattern: "approval",
		fromMe: false,
		isGroup: true,
		desc: "Toggle group join approval",
		type: "group",
		run: async (message, match) => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!match)
				return message.send(`_Usage: ${message.prefix[0]}approval on | off_`);
			match = match.toLowerCase().trim();
			if (match === "on") {
				await message.groupJoinApprovalMode(message.chat, "on");
				return message.send("_Approval mode on_");
			}
			if (match === "off") {
				await message.groupJoinApprovalMode(message.chat, "off");
				return message.send("_Approval mode off_");
			}
			return message.send(`_Usage: ${message.prefix[0]}approval on | off_`);
		},
	},
	{
		pattern: "poll",
		fromMe: false,
		isGroup: true,
		desc: "Create a poll message",
		type: "group",
		run: async (message, match) => {
			if (!match || !match.includes(";")) {
				return message.send(
					`_Usage: ${message.prefix[0]}poll question; option1, option2, option3_`
				);
			}
			const [question, optionsRaw] = match.split(";").map(s => s.trim());
			if (!question || !optionsRaw)
				return message.send("_Provide a question and options_");
			const options = optionsRaw
				.split(",")
				.map(opt => opt.trim())
				.filter(Boolean);
			if (options.length < 2) return message.send("_Add at least 2 options_");
			await message.sendMessage(message.chat, {
				poll: { name: question, values: options, selectableCount: 1 },
			});
		},
	},
	{
		pattern: "leave",
		fromMe: true,
		isGroup: true,
		desc: "Leave a group",
		type: "group",
		run: async message => {
			return await message.groupLeave(message.chat);
		},
	},
	{
		pattern: "requests",
		fromMe: false,
		isGroup: true,
		desc: "Get group join requests",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const requests = await message.groupRequestParticipantsList(message.chat);
			if (!requests || requests.length === 0) {
				return message.send("_No join requests found_");
			}
			const participants = requests.map(p => p.id);
			return await message.send(
				`_Join requests: ${participants.length}_\n\n` +
					participants.map(p => `@${p.split("@")[0]}`).join("\n"),
				{
					mentions: participants,
				}
			);
		},
	},
	{
		pattern: "accept",
		fromMe: false,
		isGroup: true,
		desc: "Approve a group join request",
		type: "group",
		run: async message => {
			const requests = await message.groupRequestParticipantsList(message.chat);
			if (!requests || requests.length === 0) {
				return message.send("_No join requests found_");
			}
			const participants = requests.map(p => p.id);
			await message.groupRequestParticipantsUpdate(
				message.chat,
				participants,
				"approve"
			);
			return await message.send(
				`_Approved members: ${participants
					.map(p => `@${p.split("@")[0]}`)
					.join(", ")}_`,
				{
					mentions: participants,
				}
			);
		},
	},
	{
		pattern: "reject",
		fromMe: false,
		isGroup: true,
		desc: "Reject all group join requests",
		type: "group",
		run: async message => {
			if (!message.isAdmin) return message.send(lang.BOT_NOT_ADMIN);
			if (!message.isBotAdmin) return message.send(lang.BOT_NOT_ADMIN);
			const requests = await message.groupRequestParticipantsList(message.chat);
			if (!requests || requests.length === 0) {
				return message.send("_No join requests found_");
			}
			const participants = requests.map(p => p.id);
			await message.groupRequestParticipantsUpdate(
				message.chat,
				participants,
				"reject"
			);
			return await message.send(
				`_Rejected members: ${participants
					.map(p => `@${p.split("@")[0]}`)
					.join(", ")}_`,
				{
					mentions: participants,
				}
			);
		},
	},
] satisfies CommandModule[];
