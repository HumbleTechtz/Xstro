import { updateMetaGroup } from "src";
import type { GroupMetadata, WASocket } from "baileys";

export function socketHooks(sock: WASocket) {
	setTimeout(async () => {
		fetchAndUpdateGroups(sock);
		setInterval(fetchAndUpdateGroups, 45 * 1000);
	}, 5000);
}

export const fetchAndUpdateGroups = async (sock: WASocket) => {
	try {
		if (!sock.authState?.creds?.registered) return;

		const data = await sock.groupFetchAllParticipating();
		for (const [jid, metadata] of Object.entries(data)) {
			updateMetaGroup(jid, metadata as GroupMetadata);
		}
	} catch {}
};
