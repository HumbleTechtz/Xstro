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
		setInterval(fetchAndUpdateGroups, 10 * 60 * 1000);
	}, 5000); // Fetch every 10 minutes, it's the safest way to avoid being rate limited, because Baileys just needs the partiicipants Array to be able to actaully send messages to the group, so we don't need to fetch it every 5 minutes, but as soon as the socket is connected fetch our groups as inital data inn 5 Secs
}
