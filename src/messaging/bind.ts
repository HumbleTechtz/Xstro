import { type WASocket } from 'baileys';
import { updateMetaGroup } from '../models/group.ts';

export default async function (sock: WASocket) {
	setInterval(async () => {
		try {
			const data = await sock.groupFetchAllParticipating();
			for (const [jid, metadata] of Object?.entries(data)) {
				await updateMetaGroup(jid, metadata);
			}
		} catch (e) {}
	}, 600_000);
}
