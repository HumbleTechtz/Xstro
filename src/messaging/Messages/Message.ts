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
	sender: string;
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
	user: (match?: string) => Promise<string | undefined>;
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
		const msg = await prepareMessage(client, content, { ...options, jid });
		return new Message(
			await (
				await import('../serialize.ts')
			).serialize(client, msg as WAMessage),
			client,
		);
	}

	async edit(text: string) {
		if (this.image || this.video) {
			const media = await this.downloadM();
			return await this.client.sendMessage(
				this.jid,
				this.image
					? { image: media, caption: text, edit: this.key }
					: { video: media, caption: text, edit: this.key },
			);
		}
		return await this.client.sendMessage(this.jid, { text, edit: this.key });
	}

	async delete() {
		const canDeleteForAll =
			this.key.fromMe ||
			(this.isGroup && (await isBotAdmin(this.client as WASocket, this.jid)));

		if (!canDeleteForAll) {
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

	async forward(jid: string, options?: WAContextInfo & { quoted: WAMessage }) {
		return await this.client.sendMessage(
			jid,
			{
				forward: this,
				contextInfo: { ...options },
			},
			{ quoted: options?.quoted },
		);
	}

	async react(emoji?: string) {
		return await this.client.sendMessage(this.jid, {
			react: { text: emoji, key: this.key },
		});
	}
}
