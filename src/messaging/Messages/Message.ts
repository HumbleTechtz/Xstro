import ReplyMessage from './ReplyMessage.ts';
import {
	isBotAdmin,
	isMediaMessage,
	prepareMessage,
} from '../../utils/index.ts';
import {
	downloadMediaMessage,
	type WAContextInfo,
	type WASocket,
	type AnyMessageContent,
	type WAMessageKey,
	type WAMessageContent,
	type WAMessage,
} from 'baileys';
import type { Serialize, MessageMisc } from '../../types/index.ts';

export default class Message {
	client: Omit<
		WASocket,
		'logger' | 'ws' | 'ev' | 'authState' | 'signalRepository'
	>;
	key: WAMessageKey;
	jid: string;
	prefix: string[];
	isGroup: boolean | undefined;
	sender: string | null | undefined;
	message: WAMessageContent | undefined;
	type: keyof WAMessageContent | undefined;
	messageTimestamp: number | Long | null | undefined;
	sudo: boolean;
	owner: string;
	pushName: string | null | undefined;
	mention: string[] | null | undefined;
	image: boolean;
	video: boolean;
	audio: boolean;
	mode: boolean;
	user: (match?: string) => string | undefined;
	quoted?: ReplyMessage;
	text?: string | null | undefined;

	constructor(data: Serialize, client: WASocket) {
		const { logger, ws, ev, authState, signalRepository, ...props } = client;
		const {
			key,
			jid,
			prefix,
			isGroup,
			sender,
			message,
			mtype,
			mode,
			sudo,
			owner,
			pushName,
			mention,
			text,
			messageTimestamp,
			user,
			quoted,
		} = data;
		this.client = props;
		this.key = key;
		this.jid = jid;
		this.prefix = prefix;
		this.isGroup = isGroup;
		this.sender = sender;
		this.message = message;
		this.type = mtype;
		this.sudo = sudo;
		this.owner = owner;
		this.pushName = pushName;
		this.mention = mention;
		this.image = mtype === 'imageMessage';
		this.video = mtype === 'videoMessage';
		this.audio = mtype === 'audioMessage';
		this.mode = mode;
		this.messageTimestamp = messageTimestamp;
		this.text = text;
		this.user = user;
		this.quoted = quoted
			? new ReplyMessage(data.quoted, this.client)
			: undefined;
	}

	async send(
		content: string | Buffer,
		options?: MessageMisc & Partial<AnyMessageContent>,
	) {
		const client = this.client as WASocket;
		const jid = options?.jid ?? this.jid;
		const updatedOptions = { ...options, jid };
		const msg = await prepareMessage(client, content, updatedOptions);
		return new Message(
			await (
				await import('../serialize.ts')
			).serialize(client, msg as WAMessage),
			client,
		);
	}

	async edit(text: string) {
		if (this.image) {
			return await this.client.sendMessage(this.jid, {
				image: await this.downloadM(),
				caption: text,
				edit: this.key,
			});
		} else if (this.video) {
			return await this.client.sendMessage(this.jid, {
				video: await this.downloadM(),
				caption: text,
				edit: this.key,
			});
		} else {
			return await this.client.sendMessage(this.jid, { text, edit: this.key });
		}
	}

	async delete() {
		const isRestrictedGroup =
			this.isGroup && !(await isBotAdmin(this.client, this.jid));
		const isPrivateNotMe = !this.isGroup && !this.key.fromMe;

		if (isRestrictedGroup || isPrivateNotMe) {
			return await this.client.chatModify(
				{
					deleteForMe: {
						deleteMedia: isMediaMessage(this),
						key: this.key,
						timestamp: Date.now(),
					},
				},
				this.jid,
			);
		}
		return await this.client.sendMessage(this.jid, { delete: this.key });
	}

	async downloadM() {
		return await downloadMediaMessage(this, 'buffer', {});
	}

	async forward(jid: string, options?: WAContextInfo) {
		return await this.client.sendMessage(jid, {
			forward: this,
			contextInfo: { ...options },
		});
	}

	async react(emoji?: string) {
		return await this.client.sendMessage(this.jid, {
			react: { text: emoji, key: this.key },
		});
	}
}
