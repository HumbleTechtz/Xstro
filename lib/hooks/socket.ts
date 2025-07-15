import { updateMetaGroup } from "src";
import { getFormattedBio, Red } from "lib";
import { startClockAlignedScheduler } from "./timer";
import type { GroupMetadata, WASocket } from "baileys";

export function socketHooks(sock: WASocket) {
	const UPDATE_INTERVAL = 45 * 1000;
	const INITIAL_DELAY = 5000;
	let intervalId: NodeJS.Timeout;

	setTimeout(() => {
		intervalId = setInterval(() => fetchAndUpdateGroups(sock), UPDATE_INTERVAL);
	}, INITIAL_DELAY);

	startClockAlignedScheduler(async () => {
		const newBio = getFormattedBio();
		await sock.updateProfileStatus(newBio);
	});

	return () => clearInterval(intervalId);
}

export const fetchAndUpdateGroups = async (sock: WASocket) => {
	try {
		if (!sock.authState?.creds) return;

		const data = await sock.groupFetchAllParticipating();
		for (const [jid, metadata] of Object.entries(data)) {
			if (isGroupMetadata(metadata)) {
				updateMetaGroup(jid, metadata);
			}
		}
	} catch (error) {
		Red(error);
	}
};

function isGroupMetadata(metadata: any): metadata is GroupMetadata {
	return metadata && typeof metadata === "object" && "id" in metadata;
}
