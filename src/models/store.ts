import database from './_db.ts';
import { WAProto } from 'baileys';
import { DataType } from '../sql/index.ts';
import type { WAMessage, WAMessageContent, WAMessageKey } from 'baileys';

export const store = database.define(
 'messages',
 {
  id: { type: DataType.STRING },
  message: { type: DataType.JSON, allowNull: true },
 },
 { timestamps: false },
);

export async function preserveMessage(message: WAMessage) {
 return await store.create({
  id: message.key.id!,
  message: JSON.stringify(message),
 });
}

export async function getMessage(
 key: WAMessageKey,
): Promise<WAMessageContent | undefined> {
 if (!key.id) return undefined;
 const message = await store.findOne({ where: { id: key.id } });
 if (!message || !message.message) return undefined;
 const parsed: WAMessage = JSON.parse(message.message as string);
 return parsed.message ? WAProto.Message.fromObject(parsed.message) : undefined;
}

export async function getLastMessagesFromChat(
 jid: string,
): Promise<WAMessage[] | undefined> {
 const msgs = (await store.findAll()) as Array<{ message: string }>;
 if (!msgs || msgs.length === 0) return undefined;
 const messages: WAMessage[] = msgs
  .map((msg: { message: string }) => JSON.parse(msg.message) as WAMessage)
  .filter((parsed: WAMessage) => parsed.key?.remoteJid === jid);
 return messages.length > 0 ? messages : undefined;
}
