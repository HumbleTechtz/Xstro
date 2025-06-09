import type { WASocket } from "baileys";

export default class GroupParticipant {
	client: WASocket;
	constructor(client: WASocket) {
		this.client = client;
		Promise.all([this.group_participant_update(), this.group_join_request]);
	}
	async group_participant_update() {
		this.client.ev.on(
			"group-participants.update",
			async ({ id, author, participants, action }) => {
				console.log({ id, author, participants, action });
			},
		);
	}
	async group_join_request() {}
}
