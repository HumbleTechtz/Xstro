import { updateMetaGroup } from "../../group.ts";
import { AutoBioDb } from "../schema/index.ts";
import { Red } from "../utils/console.ts";
import { getBio } from "../utils/constants.ts";
import { groupAutoMute } from "./automute.ts";
import { startClockAlignedScheduler } from "./timer.ts";
import type { WASocket } from "baileys";

export function registersocketHooks(sock: WASocket) {
	const schedulerCallback = async () => {
		try {
			if (AutoBioDb.get()) await sock.updateProfileStatus(getBio());
			if (!sock.authState?.creds.registered) {
				await groupAutoMute(sock);
				const data = await sock.groupFetchAllParticipating();
				for (const [jid, metadata] of Object.entries(data)) {
					updateMetaGroup(jid, metadata);
				}
			}
		} catch (e) {
			Red(e);
		}
	};

	return startClockAlignedScheduler(schedulerCallback);
}
