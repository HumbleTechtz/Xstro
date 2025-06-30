/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Controller for handling group participant updates in WhatsApp using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import lang from "../Utils/language";
import { logo } from "../Media";
import { getGoodBye, getWelcome, getAutoKick, getGroupEvent } from "../Models";
import {
	fact,
	getAdvice,
	getInsult,
	getJoke,
	getQuote,
	getRizz,
} from "../Utils";
import type { BaileysEventMap, WASocket } from "baileys";

export default class {
	client: WASocket;
	updates: BaileysEventMap["group-participants.update"];
	constructor(
		client: WASocket,
		updates: BaileysEventMap["group-participants.update"]
	) {
		this.client = client;
		this.updates = updates;
		this.group_participant_update();
	}
	async group_participant_update() {
		const { id, author, participants, action } = this.updates;
		const autokicklist = getAutoKick(id, participants[0]);
		const group_event = getGroupEvent(id);
		const welcome_msg = getWelcome(id);
		const goodbye_msg = getGoodBye(id);

		if (autokicklist && action === "add") {
			await this.client.sendMessage(id, {
				text: `\`\`\`@${
					participants[0].split("@")[0]
				} loser is back, now kicking you off\`\`\``,
				mentions: participants,
			});
			await this.client.sendMessage(id, {
				text: `\`\`\`@${
					participants[0].split("@")[0]
				} Was kicked due to AutoKick\`\`\``,
				mentions: participants,
			});
			await this.client.groupParticipantsUpdate(id, participants, "remove");
			return;
		}

		if (group_event && ["promote", "demote", "modify"].includes(action)) {
			const participant = participants[0];
			let profileImg: string | undefined;

			try {
				profileImg = await this.client.profilePictureUrl(participant, "image");
			} catch {}

			const content = `\`\`\`@${participant.split("@")[0]} ${
				action === "promote"
					? `was given the administrator role by @${author.split("@")[0]} `
					: action === "demote"
					? `was removed from their admin role by @${author.split("@")[0]}`
					: ""
			}\`\`\``.trim();

			const message = profileImg
				? {
						image: { url: profileImg },
						caption: content,
				  }
				: { text: content };

			await this.client.sendMessage(id, {
				...message,
				contextInfo: {
					mentionedJid: [participant, author],
					externalAdReply: {
						title: lang.BOT_NAME,
						body: lang.BOT_DESCRIPTION_INFO,
						thumbnail: logo instanceof Buffer ? new Uint8Array(logo) : logo,
						showAdAttribution: true,
					},
				},
			});
		}

		if (["add", "remove"].includes(action) && (welcome_msg || goodbye_msg)) {
			const participant = participants[0];
			let profileImg: string | undefined;

			try {
				profileImg = await this.client.profilePictureUrl(participant, "image");
			} catch {}

			const groupMetadata = await this.client.groupMetadata(id);
			const membersCount = groupMetadata.participants.length;
			const groupDesc = groupMetadata.desc || "";
			const groupName = groupMetadata.subject || "";

			const replacements: Record<string, string> = {
				"@user": `@${participant.split("@")[0]}`,
				"@gdesc": groupDesc,
				"@gname": groupName,
				"@fact": await fact(),
				"@rizz": await getRizz(),
				"@insult": await getInsult(),
				"@joke": await getJoke(),
				"@advice": await getAdvice(),
				"@quotes": await getQuote(),
				"@members": `${membersCount}`,
			};

			let text: string = "";
			if (action === "add" && welcome_msg) text = welcome_msg;
			else if (action === "remove" && goodbye_msg) text = goodbye_msg;

			if (!text) return;

			const hasImage = profileImg && text.includes("@pp");
			text = text.replace(/@pp/g, "");

			for (const [placeholder, value] of Object.entries(replacements)) {
				text = text.replace(new RegExp(placeholder, "g"), value);
			}

			const finalText = `\`\`\`${text.trim()}\`\`\``;

			const messageContent =
				hasImage && profileImg
					? {
							image: { url: profileImg },
							caption: finalText,
					  }
					: { text: finalText };

			await this.client.sendMessage(id, {
				...messageContent,
				contextInfo: {
					mentionedJid: [participant, author].filter(Boolean),
					externalAdReply: {
						title: lang.BOT_NAME,
						body: lang.BOT_DESCRIPTION_INFO,
						thumbnail: logo instanceof Buffer ? new Uint8Array(logo) : logo,
						showAdAttribution: true,
					},
				},
			});
		}
	}
}
