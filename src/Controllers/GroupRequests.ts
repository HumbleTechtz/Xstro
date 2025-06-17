/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Controller for handling group join requests in WhatsApp using Baileys library.
 * @copyright Copyright (c) 2025 AstroX11
 */

import lang from "../Utils/lang.ts";
import { logo } from "../Utils/index.ts";
import { getGroupEvent } from "../Models/GroupEvents.ts";
import type { BaileysEventMap, WASocket } from "baileys";

export default class GroupRequests {
	protected client: WASocket;
	protected events: BaileysEventMap["group.join-request"];

	constructor(client: WASocket, events: BaileysEventMap["group.join-request"]) {
		this.client = client;
		this.events = events;
		this.updates();
	}

	private async updates() {
		const { id, author, participant, action, method } = this.events;
		const enabled = await getGroupEvent(id);

		if (!enabled) return;

		try {
			let profileImg: string | undefined;

			try {
				profileImg = await this.client.profilePictureUrl(participant, "image");
			} catch {}

			const groupMetadata = await this.client.groupMetadata(id);
			const groupName = groupMetadata.subject || "";

			const actionText = this.getActionText(action, method!);
			const participantName = participant.split("@")[0];
			const authorName = author ? author.split("@")[0] : "System";

			const content = `\`\`\`${actionText
				.replace("@participant", `@${participantName}`)
				.replace("@author", `@${authorName}`)
				.replace("@group", groupName)}\`\`\``;

			const messageContent = profileImg
				? {
						image: { url: profileImg },
						caption: content,
				  }
				: { text: content };

			await this.client.sendMessage(id, {
				...messageContent,
				contextInfo: {
					mentionedJid: [participant, author].filter(Boolean),
					externalAdReply: {
						title: lang.BOT_NAME,
						body: lang.BOT_DESCRIPTION_INFO,
						thumbnail: logo,
						showAdAttribution: true,
					},
				},
			});
		} catch (error) {
			console.error("GroupRequests error:", error);
		}
	}

	private getActionText(action: string, method: string): string {
		const methodText =
			method === "invite_link" ? "via invite link" : "by request";

		switch (action) {
			case "created":
				return `@participant requested to join @group ${methodText}`;
			case "rejected":
				return `@author rejected @participant's request to join @group`;
			case "revoked":
				return `@participant cancelled their request to join @group`;
			default:
				return `@participant requested to join @group ${methodText}`;
		}
	}
}
