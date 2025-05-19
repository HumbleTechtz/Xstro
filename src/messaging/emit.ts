import ConnectionUpdate from './Class/Controllers/Connection.ts';
import MessageUpsert from './Class/Controllers/MessageUpsert.ts';
import type { WASocket } from 'baileys';

export default function (
	clientSocket: WASocket,
	{ saveCreds }: { saveCreds: () => Promise<void> },
) {
	clientSocket.ev.process(async events => {
		if (events['creds.update']) {
			await saveCreds();
		}

		if (events['connection.update']) {
			new ConnectionUpdate(clientSocket, events['connection.update']);
		}

		if (events['messages.upsert']) {
			new MessageUpsert(clientSocket, events['messages.upsert']);
		}
	});
}
