/**
This implemenatation for channels now is very poor
 */

import type { CommandModule } from "../lib/client";

export default [
	{
		pattern: "newsletter",
		fromMe: true,
		isGroup: false,
		desc: "Create a newsletter",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(
					`Example:\n ${message.prefix[0]}newsletter AstroUpdates:My Channel to follow for updates`
				);
			const meta = args.split(":");
			const { invite } = await message.newsletterCreate(meta[0], meta[1]);
			return await message.send(
				`Created Channel:\n` + `https://whatsapp.com/channel/${invite}`
			);
		},
	},
	{
		pattern: "nlupdate",
		fromMe: true,
		isGroup: false,
		desc: "Update newsletter name/description",
		type: "newsletter",
		run: async (message, args) => {
			if (!message.newsletter) return message.send("For Channels only!");
			if (!args)
				return message.send(
					`Example:\n ${message.prefix[0]}nlupdate name:NewName\n ${message.prefix[0]}nlupdate desc:New Description\n ${message.prefix[0]}nlupdate both:NewName:New Description`
				);

			const [type, ...content] = args.split(":");
			const jid = message.chat;

			if (type === "name") {
				await message.newsletterUpdateName(jid, content.join(":"));
				return message.send("Newsletter name updated successfully");
			} else if (type === "desc") {
				await message.newsletterUpdateDescription(jid, content.join(":"));
				return message.send("Newsletter description updated successfully");
			} else if (type === "both") {
				const [name, description] = content;
				await message.newsletterUpdate(jid, { name, description });
				return message.send("Newsletter updated successfully");
			}

			return message.send("Invalid update type. Use: name, desc, or both");
		},
	},
	{
		pattern: "nlfollow",
		fromMe: true,
		isGroup: false,
		desc: "Follow a newsletter",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nlfollow channelJid`);

			await message.newsletterFollow(args);
			return message.send("Successfully followed the newsletter");
		},
	},
	{
		pattern: "nlunfollow",
		fromMe: true,
		isGroup: false,
		desc: "Unfollow a newsletter",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nlunfollow channelJid`);

			await message.newsletterUnfollow(args);
			return message.send("Successfully unfollowed the newsletter");
		},
	},
	{
		pattern: "nlmute",
		fromMe: true,
		isGroup: false,
		desc: "Mute a newsletter",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nlmute channelJid`);

			await message.newsletterMute(args);
			return message.send("Newsletter muted successfully");
		},
	},
	{
		pattern: "nlunmute",
		fromMe: true,
		isGroup: false,
		desc: "Unmute a newsletter",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nlunmute channelJid`);

			await message.newsletterUnmute(args);
			return message.send("Newsletter unmuted successfully");
		},
	},
	{
		pattern: "nlinfo",
		fromMe: true,
		isGroup: false,
		desc: "Get newsletter metadata",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(
					`Example:\n ${message.prefix[0]}nlinfo invite:inviteCode\n ${message.prefix[0]}nlinfo jid:channelJid`
				);

			const [type, key] = args.split(":");
			const metadata = await message.newsletterMetadata(
				type as "invite" | "jid",
				key
			);

			if (!metadata) return message.send("Newsletter not found");

			return message.send(
				`Newsletter Info:\nID: ${metadata.id}\nName: ${
					metadata.name
				}\nDescription: ${metadata.description || "No description"}\nSubscribers: ${
					metadata.subscribers
				}\nVerified: ${metadata.verification === "VERIFIED" ? "Yes" : "No"}`
			);
		},
	},
	{
		pattern: "nlsubs",
		fromMe: true,
		isGroup: false,
		desc: "Get newsletter subscriber count",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nlsubs channelJid`);

			const { subscribers } = await message.newsletterSubscribers(args);
			return message.send(`Subscribers: ${subscribers}`);
		},
	},
	{
		pattern: "nlpic",
		fromMe: true,
		isGroup: false,
		desc: "Update newsletter picture",
		type: "newsletter",
		run: async message => {
			if (!message.newsletter) return message.send("For Channels only!");
			const quoted = message.quoted;
			if (!quoted || !quoted?.image)
				return message.send("Reply to an image to update newsletter picture");

			const jid = message.chat;
			await message.newsletterUpdatePicture(
				jid,
				(await message.download({ message: quoted })) as Buffer
			);
			return message.send("Newsletter picture updated successfully");
		},
	},
	{
		pattern: "nlrmpic",
		fromMe: true,
		isGroup: false,
		desc: "Remove newsletter picture",
		type: "newsletter",
		run: async message => {
			if (!message.newsletter) return message.send("For Channels only!");
			const jid = message.chat;
			await message.newsletterRemovePicture(jid);
			return message.send("Newsletter picture removed successfully");
		},
	},
	{
		pattern: "nlreact",
		fromMe: true,
		isGroup: false,
		desc: "React to newsletter message",
		type: "newsletter",
		run: async (message, args) => {
			const quoted = message.quoted;
			if (!quoted) return message.send("Reply to a newsletter message to react");

			const jid = message.chat;
			const serverId = quoted.key?.id;
			if (!serverId) return message.send("Invalid message to react to");

			await message.newsletterReactMessage(jid, serverId, args || "👍");
			return message.send(`Reacted with ${args || "👍"}`);
		},
	},
	{
		pattern: "nlfetch",
		fromMe: true,
		isGroup: false,
		desc: "Fetch newsletter messages",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(
					`Example:\n ${message.prefix[0]}nlfetch channelJid:count:since:after`
				);

			const [jid, count = "10", since = "0", after = "0"] = args.split(":");
			const messages = await message.newsletterFetchMessages(
				jid,
				parseInt(count),
				parseInt(since),
				parseInt(after)
			);

			return message.send(`Fetched ${messages?.length || 0} messages`);
		},
	},
	{
		pattern: "nlsub",
		fromMe: true,
		isGroup: false,
		desc: "Subscribe to newsletter updates",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nlsub channelJid`);

			const result = await message.subscribeNewsletterUpdates(args);
			if (result) {
				return message.send(`Subscribed to updates for ${result.duration}`);
			}
			return message.send("Failed to subscribe to newsletter updates");
		},
	},
	{
		pattern: "nladmin",
		fromMe: true,
		isGroup: false,
		desc: "Get newsletter admin count",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nladmin channelJid`);

			const count = await message.newsletterAdminCount(args);
			return message.send(`Admin count: ${count}`);
		},
	},
	{
		pattern: "nlowner",
		fromMe: true,
		isGroup: false,
		desc: "Change newsletter owner",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(
					`Example:\n ${message.prefix[0]}nlowner channelJid:newOwnerJid`
				);

			const [jid, newOwnerJid] = args.split(":");
			await message.newsletterChangeOwner(jid, newOwnerJid);
			return message.send("Newsletter ownership transferred successfully");
		},
	},
	{
		pattern: "nldemote",
		fromMe: true,
		isGroup: false,
		desc: "Demote newsletter admin",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(
					`Example:\n ${message.prefix[0]}nldemote channelJid:userJid`
				);

			const [jid, userJid] = args.split(":");
			await message.newsletterDemote(jid, userJid);
			return message.send("User demoted successfully");
		},
	},
	{
		pattern: "nldelete",
		fromMe: true,
		isGroup: false,
		desc: "Delete newsletter",
		type: "newsletter",
		run: async (message, args) => {
			if (!args)
				return message.send(`Example:\n ${message.prefix[0]}nldelete channelJid`);

			await message.newsletterDelete(args);
			return message.send("Newsletter deleted successfully");
		},
	},
] satisfies CommandModule[];
