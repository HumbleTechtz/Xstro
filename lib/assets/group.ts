import { groupMetadata, updateMetaGroup } from "src";
import { isJidUser, isLidUser } from "baileys";
import { en } from "lib/resources";
import type { CommandModule } from "@types";

export default [
	{
		pattern: "add",
		fromMe: true,
		isGroup: true,
		desc: "Add a participant to a group",
		type: "group",
		handler: async (msg, args) => {
			const user = await msg.user(args);
			if (!isJidUser(user.id) && !isLidUser(user.id))
				return msg.send(en.warn.invaild_user);
			await msg.groupParticipantsUpdate(msg.chat, [user.id], "add");
			updateMetaGroup(msg.chat, await msg.groupMetadata(msg.chat));
			const groupInfo = groupMetadata(msg.chat);
			const participants = groupInfo.participants.flatMap(p => [p.jid, p.lid]);
			if (!participants.includes(user.id))
				return msg.send(en.plugin.groups.add.fail);
			return msg.send(en.plugin.groups.add.success);
		},
	},
	{
		pattern: "kick",
		fromMe: true,
		isGroup: true,
		desc: "Add a participant to a group",
		type: "group",
		handler: async (msg, args) => {
			const user = await msg.user(args);
			if (!isJidUser(user.id) && !isLidUser(user.id))
				return msg.send(en.warn.invaild_user);
			await msg.groupParticipantsUpdate(msg.chat, [user.id], "remove");
			return await msg.send(en.plugin.groups.kick.success);
		},
	},
] satisfies CommandModule[];
