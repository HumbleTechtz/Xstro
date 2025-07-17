import { updateMetaGroup } from "src";
import { getFormattedBio, Red } from "lib";
import { startClockAlignedScheduler } from "./timer";
import type { GroupMetadata, WASocket } from "baileys";

export function socketHooks(sock: WASocket) {
	const schedulerCallback = async () => {
		await sock.updateProfileStatus(getFormattedBio());

		try {
			if (!sock.authState?.creds) return;

			const data = await sock.groupFetchAllParticipating();
			for (const [jid, metadata] of Object.entries(data)) {
				updateMetaGroup(jid, metadata);
			}
		} catch (e) {
			Red(e);
		}
	};

	return startClockAlignedScheduler(schedulerCallback);
}
