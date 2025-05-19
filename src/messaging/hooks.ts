import { type WASocket } from 'baileys';
import { updateMetaGroup } from '../models/group.ts';

export default function (sock: WASocket) {
	const fetchAndUpdateGroups = async () => {
		try {
			const data = await sock.groupFetchAllParticipating();
			for (const [jid, metadata] of Object.entries(data)) {
				await updateMetaGroup(jid, metadata);
			}
		} catch (e) {
			console.error('Failed to update group metadata:', e);
		}
	};

	setTimeout(() => {
		fetchAndUpdateGroups();
		setInterval(fetchAndUpdateGroups, 5 * 60 * 1000);
	}, 5000);
}
