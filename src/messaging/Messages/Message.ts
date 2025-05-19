import Base from './Base.ts';
import ReplyMessage from './ReplyMessage.ts';
import { prepareMessage } from '../../utils/index.ts';
import type { Serialize, MessageMisc } from '../../types/index.ts';
import type { WASocket, AnyMessageContent } from 'baileys';

export default class Message extends Base {
	public quoted?: ReplyMessage;
	public text?: string | null | undefined;

	constructor(data: Serialize, client: WASocket) {
		super(data, client);
		this.key = data.key;
		this.text = data.text;
		this.quoted = data.quoted ? new ReplyMessage(data, this.client) : undefined;
		this.user = data.user;
	}

	async send(
		content: string | Buffer,
		options?: MessageMisc & Partial<AnyMessageContent>,
	) {
		const jid = options?.jid ?? this.jid;
		const updatedOptions = { ...options, jid };
		const msg = await prepareMessage(this.client, content, updatedOptions);
		return new Message(
			await (await import('../serialize.ts')).serialize(this.client, msg!),
			this.client,
		);
	}

	async edit(text: string) {
		return await super.edit(text, this.key);
	}

	async delete() {
		return await super.delete(this.key);
	}

	async downloadM() {
		return await super.downloadM(this.data);
	}

	async isAdmin() {
		return await super.isAdmin(this.sender ?? '');
	}

	async isBotAdmin() {
		return await super.isBotAdmin();
	}

	async forward(jid: string) {
		return await super.forward(jid, this?.data);
	}

	async react(emoji: string) {
		return await super.react(emoji, this?.key ?? '');
	}
}
