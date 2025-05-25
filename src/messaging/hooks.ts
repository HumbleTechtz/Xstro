import { type WASocket } from 'baileys';
import { updateMetaGroup } from '../models/group.ts';

export default function (sock: WASocket) {
	const fetchAndUpdateGroups = async () => {
		try {
			if (!sock.authState?.creds?.registered) return;
			const data = await sock.groupFetchAllParticipating();
			for (const [jid, metadata] of Object.entries(data)) {
				await updateMetaGroup(jid, metadata);
			}
		} catch (e) {
			/** Just handle it slienly, we're not doing anything with it's error  */
		}
	};

	setTimeout(() => {
		fetchAndUpdateGroups();
		setInterval(fetchAndUpdateGroups, 45 * 1000);
	}, 5000);
}
