import { Command } from "../../messaging/plugin.ts";
import { cachedGroupMetadata } from "../../models/group.ts";
import { adminCheck } from "../../utils/constants.ts";

Command({
	name: "add",
	fromMe: true,
	isGroup: true,
	desc: "Add participant to group",
	type: "group",
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send("_Provide a valid number_");
		const user = `${match}@s.whatsapp.net`;
		if (!(await message.onWhatsApp(user))) {
			return message.send("_Invalid number_");
		}
		await message.groupParticipantsUpdate(message.jid, [user], "add");
		message.send(`_@${user.split("@")[0]} added to group_`, {
			mentions: [user],
		});
	},
});

Command({
	name: "kick",
	fromMe: false,
	isGroup: true,
	desc: "Remove participant from group",
	type: "group",
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send("_Provide a valid number or mention_");
		const user = await message.user(match);
		if (!user) return message.send("_Invalid number or mention_");
		await message.groupParticipantsUpdate(message.jid, [user], "remove");
		message.send(`_@${user.split("@")[0]} kicked from group_`, {
			mentions: [user],
		});
	},
});

Command({
	name: "kickall",
	fromMe: true,
	isGroup: true,
	desc: "Kickall all participants from a Group",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const groupData = await cachedGroupMetadata("120363286769939283@g.us");
		const participants = groupData.participants
			.filter(p => !p.admin)
			.map(p => p.id);

		await message.groupParticipantsUpdate(message.jid, participants, "remove");
	},
});

Command({
	name: "promote",
	fromMe: false,
	isGroup: true,
	desc: "Promote participant to admin",
	type: "group",
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send("_Provide a valid number or mention_");
		const user = await message.user(match);
		if (!user) return message.send("_Invalid number or mention_");
		const groupData = await cachedGroupMetadata(message.jid);
		const admins = groupData.participants.filter(v => v.admin).map(v => v.id);
		if (admins.includes(user)) {
			return message.send(`_@${user.split("@")[0]} is already admin_`, {
				mentions: [user],
			});
		}
		await message.groupParticipantsUpdate(message.jid, [user], "promote");
		return await message.send(`_@${user.split("@")[0]} is now admin_`, {
			mentions: [user],
		});
	},
});

Command({
	name: "demote",
	fromMe: false,
	isGroup: true,
	desc: "Demote admin to participant",
	type: "group",
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send("_Provide a valid number or mention_");
		const user = await message.user(match);
		if (!user) return message.send("_Invalid number or mention_");
		const groupData = await cachedGroupMetadata(message.jid);
		const admins = groupData.participants.filter(v => v.admin).map(v => v.id);
		if (!admins.includes(user)) {
			return message.send(`_@${user.split("@")[0]} is not admin_`, {
				mentions: [user],
			});
		}
		await message.groupParticipantsUpdate(message.jid, [user], "demote");
		return await message.send(`_@${user.split("@")[0]} is no longer admin_`, {
			mentions: [user],
		});
	},
});

Command({
	name: "newgc",
	fromMe: true,
	isGroup: false,
	desc: "Create new group",
	type: "group",
	function: async (message, match) => {
		if (!match) return message.send("_Provide group name_");
		const gc = await message.groupCreate(match, [message.owner]);
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
});

Command({
	name: "tag",
	fromMe: false,
	isGroup: true,
	desc: "Mention entire group",
	type: "group",
	function: async (message, match) => {
		const { participants } = await cachedGroupMetadata(message.jid);
		return await message.relayMessage(
			message.jid,
			{
				extendedTextMessage: {
					text: `@${message.jid} ${match ?? ""}`,
					contextInfo: {
						mentionedJid: participants.filter(p => p.id).map(p => p.id),
						groupMentions: [{ groupJid: message.jid, groupSubject: "everyone" }],
					},
				},
			},
			{},
		);
	},
});

Command({
	name: "gname",
	fromMe: false,
	isGroup: true,
	desc: "Update group name",
	type: "group",
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send("_Provide new group name_");
		await message.groupUpdateSubject(message.jid, match);
		return await message.send("_Group name updated_");
	},
});

Command({
	name: "gdesc",
	fromMe: false,
	isGroup: true,
	desc: "Update group description",
	type: "group",
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match) return message.send("_Provide new group description_");
		await message.groupUpdateDescription(message.jid, match);
		return await message.send("_Group description updated_");
	},
});

Command({
	name: "mute",
	fromMe: false,
	isGroup: true,
	desc: "Allow only admins to send messages",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (metadata.announce) return message.send("_Group already muted_");
		await message.groupSettingUpdate(message.jid, "announcement");
		return await message.send("_Group muted, only admins can send messages_");
	},
});

Command({
	name: "unmute",
	fromMe: false,
	isGroup: true,
	desc: "Allow all members to send messages",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (!metadata.announce) return message.send("_Group already unmuted_");
		await message.groupSettingUpdate(message.jid, "not_announcement");
		return await message.send("_Group unmuted, all members can send messages_");
	},
});

Command({
	name: "lock",
	fromMe: false,
	isGroup: true,
	desc: "Restrict settings to admins",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (metadata.restrict)
			return message.send("_Group settings already restricted_");
		await message.groupSettingUpdate(message.jid, "locked");
		return await message.send("_Group settings restricted to admins_");
	},
});

Command({
	name: "unlock",
	fromMe: false,
	isGroup: true,
	desc: "Allow all members to manage settings",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const metadata = await cachedGroupMetadata(message.jid);
		if (!metadata.restrict)
			return message.send("_Group settings already unrestricted_");
		await message.groupSettingUpdate(message.jid, "unlocked");
		return await message.send("_Group settings unrestricted_");
	},
});

Command({
	name: "invite",
	fromMe: false,
	isGroup: true,
	desc: "Get group invite link",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const code = await message.groupInviteCode(message.jid);
		return await message.send(`_https://chat.whatsapp.com/${code}_`);
	},
});

Command({
	name: "revoke",
	fromMe: false,
	isGroup: true,
	desc: "Revoke group invite code",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const code = await message.groupRevokeInvite(message.jid);
		return await message.send(`_https://chat.whatsapp.com/${code}_`);
	},
});

Command({
	name: "approval",
	fromMe: false,
	isGroup: true,
	desc: "Toggle group join approval",
	type: "group",
	function: async (message, match) => {
		if (!(await adminCheck(message))) return;
		if (!match)
			return message.send(`_Usage: ${message.prefix[0]}approval on | off_`);
		match = match.toLowerCase().trim();
		if (match === "on") {
			await message.groupJoinApprovalMode(message.jid, "on");
			return message.send("_Approval mode on_");
		}
		if (match === "off") {
			await message.groupJoinApprovalMode(message.jid, "off");
			return message.send("_Approval mode off_");
		}
		return message.send(`_Usage: ${message.prefix[0]}approval on | off_`);
	},
});

Command({
	name: "poll",
	fromMe: false,
	isGroup: true,
	desc: "Create a poll message",
	type: "group",
	function: async (message, match) => {
		if (!match || !match.includes(";")) {
			return message.send(
				`_Usage: ${message.prefix[0]}poll question; option1, option2, option3_`,
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
		await message.sendMessage(message.jid, {
			poll: { name: question, values: options, selectableCount: 1 },
		});
	},
});

Command({
	name: "leave",
	fromMe: true,
	isGroup: true,
	desc: "Leave a group",
	type: "group",
	function: async message => {
		return await message.groupLeave(message.jid);
	},
});

Command({
	name: "requests",
	fromMe: false,
	isGroup: true,
	desc: "Get group join requests",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const requests = await message.groupRequestParticipantsList(message.jid);
		if (!requests || requests.length === 0) {
			return message.send("_No join requests found_");
		}
		const participants = requests.map(p => p.id);
		return await message.send(
			`_Join requests: ${participants.length}_\n\n` +
				participants.map(p => `@${p.split("@")[0]}`).join("\n"),
			{
				mentions: participants,
			},
		);
	},
});

Command({
	name: "approve",
	fromMe: false,
	isGroup: true,
	desc: "Approve a group join request",
	type: "group",
	function: async message => {
		const requests = await message.groupRequestParticipantsList(message.jid);
		if (!requests || requests.length === 0) {
			return message.send("_No join requests found_");
		}
		const participants = requests.map(p => p.id);
		await message.groupRequestParticipantsUpdate(
			message.jid,
			participants,
			"approve",
		);
		return await message.send(
			`_Approved members: ${participants.map(p => `@${p.split("@")[0]}`).join(", ")}_`,
			{
				mentions: participants,
			},
		);
	},
});

Command({
	name: "reject",
	fromMe: false,
	isGroup: true,
	desc: "Reject all group join requests",
	type: "group",
	function: async message => {
		if (!(await adminCheck(message))) return;
		const requests = await message.groupRequestParticipantsList(message.jid);
		if (!requests || requests.length === 0) {
			return message.send("_No join requests found_");
		}
		const participants = requests.map(p => p.id);
		await message.groupRequestParticipantsUpdate(
			message.jid,
			participants,
			"reject",
		);
		return await message.send(
			`_Rejected members: ${participants.map(p => `@${p.split("@")[0]}`).join(", ")}_`,
			{
				mentions: participants,
			},
		);
	},
});
