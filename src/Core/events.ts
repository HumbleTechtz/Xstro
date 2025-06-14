import ConnectionUpdate from "../Controllers/Connection.ts";
import MessageUpsert from "../Controllers/MessageUpsert.ts";
import GroupParticipant from "../Controllers/Participants.ts";
import Calls from "../Controllers/Calls.ts";
import GroupRequests from "../Controllers/GroupRequests.ts";
import type { WASocket } from "baileys";

export default function (
	clientSocket: WASocket,
	{ saveCreds }: { saveCreds: () => Promise<void> },
) {
	clientSocket.ev.process(async events => {
		if (events["creds.update"]) await saveCreds();

		if (events.call) new Calls(clientSocket, events.call);

		if (events["connection.update"])
			new ConnectionUpdate(clientSocket, events["connection.update"]);

		if (events["messages.upsert"])
			new MessageUpsert(clientSocket, events["messages.upsert"]);

		if (events["group-participants.update"])
			new GroupParticipant(clientSocket, events["group-participants.update"]);

		if (events["group.join-request"]) {
			new GroupRequests(clientSocket, events["group.join-request"]);
		}
	});
}
