import type { WAMessage, WASocket } from "baileys";
import Message from "./Message.ts";

export default class {
	client: WASocket;
	protected msg: Message;
	constructor(client: WASocket, message: WAMessage) {
		this.msg = new Message(client, message);
	}
}
