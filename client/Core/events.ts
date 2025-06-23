/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Event handler for WhatsApp bot core events.
 * @copyright Copyright (c) 2025 AstroX11
 */

import ConnectionUpdate from "../Controllers/Connection";
import MessageUpsert from "../Controllers/MessageUpsert";
import GroupParticipant from "../Controllers/Participants";
import Calls from "../Controllers/Calls";
import GroupRequests from "../Controllers/GroupRequests";
import MessageDelete from "../Controllers/MessageDelete";
import type { BaileysEventMap, WASocket } from "baileys";

export default function (
	socket: WASocket,
	{ saveCreds }: { saveCreds: () => Promise<void> }
) {
	socket.ev.process(
		/**
		 *
		 * @param events Partial<BaileysEventMap>
		 */
		async (events: Partial<BaileysEventMap>) => {
			if (events["creds.update"]) await saveCreds();

			if (events.call) new Calls(socket, events.call);

			if (events["connection.update"])
				new ConnectionUpdate(socket, events["connection.update"]);

			if (events["messages.upsert"])
				new MessageUpsert(socket, events["messages.upsert"]);

			if (events["group-participants.update"])
				new GroupParticipant(socket, events["group-participants.update"]);

			if (events["group.join-request"])
				new GroupRequests(socket, events["group.join-request"]);

			if (events["messages.delete"])
				new MessageDelete(socket, events["messages.delete"]);
		}
	);
}
