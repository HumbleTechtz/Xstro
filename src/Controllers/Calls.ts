import type { BaileysEventMap, WASocket } from "baileys";

export default class Calls {
	client: WASocket;
	events: BaileysEventMap["call"];
	constructor(client: WASocket, events: BaileysEventMap["call"]) {
		this.client = client;
		this.events = events;
	}
}
