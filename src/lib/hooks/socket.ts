import { updateMetaGroup } from "../../group.ts";
import { AutoBioDb } from "../schema/index.ts";
import { getBio } from "../utils/constants.ts";
import { groupAutoMute } from "./automute.ts";
import { startClockAlignedScheduler } from "./timer.ts";
import type { WASocket } from "baileys";

export function registersocketHooks(sock: WASocket) {
	const schedulerCallback = async () => {
		if (!sock.authState?.creds?.registered) return;
		if (await AutoBioDb.get()) await sock.updateProfileStatus(getBio());
		await groupAutoMute(sock);

		const data = await sock.groupFetchAllParticipating();
		console.log(data)
		for (const [jid, metadata] of Object.entries(data)) {
			await updateMetaGroup(jid, metadata);
		}
	};

	return startClockAlignedScheduler(schedulerCallback);
}
