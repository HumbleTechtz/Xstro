import { updateMetaGroup } from "src";
import type { GroupMetadata, WASocket } from "baileys";

export function socketHooks(sock: WASocket) {
	const fetchAndUpdateGroups = async () => {
		try {
			if (!sock.authState?.creds?.registered) return;

			const data = await sock.groupFetchAllParticipating();
			for (const [jid, metadata] of Object.entries(data)) {
				updateMetaGroup(jid, metadata as GroupMetadata);
			}
		} catch {}
	};

	setTimeout(async () => {
		fetchAndUpdateGroups();
		setInterval(fetchAndUpdateGroups, 45 * 1000);
	}, 5000);
}
