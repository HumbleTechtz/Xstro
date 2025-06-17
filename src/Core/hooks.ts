/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Hook for managing group metadata and auto-mute functionality in WhatsApp bot.
 * @copyright Copyright (c) 2025 AstroX11
 */

import lang from "../Utils/lang.ts";
import {
	getCurrentTimeString,
	startClockAlignedScheduler,
} from "../Utils/constants.ts";
import {
	updateMetaGroup,
	cachedGroupMetadataAll,
	getAutoMute,
} from "../Models/index.ts";
import type { GroupMetadata, WASocket } from "baileys";

export default function (sock: WASocket) {
	const fetchAndUpdateGroups = async () => {
		try {
			if (!sock.authState?.creds?.registered) return;

			const data = await sock.groupFetchAllParticipating();
			for (const [jid, metadata] of Object.entries(data)) {
				await updateMetaGroup(jid, metadata as GroupMetadata);
			}
		} catch {}
	};

	setTimeout(async () => {
		fetchAndUpdateGroups();
		setInterval(fetchAndUpdateGroups, 45 * 1000);
		startClockAlignedScheduler(() => groupAutoMute(sock));
	}, 5000);
}

async function groupAutoMute(client: WASocket) {
	const currentTime = getCurrentTimeString();
	const allGroupMetadata = await cachedGroupMetadataAll();

	for (const [jid] of Object.entries(allGroupMetadata)) {
		const automute = await getAutoMute(jid);
		if (!automute) continue;

		const isGroupLocked = await client.groupMetadata(jid).then(
			(metadata: GroupMetadata) => metadata?.announce === true,
			() => false
		);

		if (currentTime === automute.startTime!.toLowerCase() && !isGroupLocked) {
			await client.sendMessage(jid, {
				text: lang.GROUP_NOW_AUTO_MUTED,
			});
			await client.groupSettingUpdate(jid, "announcement");
			continue;
		}

		if (
			automute.endTime &&
			currentTime === automute.endTime.toLowerCase() &&
			isGroupLocked
		) {
			await client.sendMessage(jid, {
				text: lang.GROUP_NOW_AUTO_UNMUTED,
			});
			await client.groupSettingUpdate(jid, "not_announcement");
			continue;
		}
	}
}
