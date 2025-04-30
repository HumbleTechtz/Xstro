import { downloadMediaMessage } from 'baileys';
import { isMediaMessage } from '../../utils/index.ts';
import type { Serialize } from '../../types/bot.ts';
import type { WASocket, WAMessageKey, WAMessage, WAContextInfo } from 'baileys';

export default class Base {
 public client: WASocket;
 public data: Serialize;
 public jid: string;
 public id: string | null | undefined;
 public fromMe: boolean | null | undefined;
 public participant: string | null | undefined;
 public pushName: string | null | undefined;
 public key: WAMessageKey;
 public owner: string;
 public sender: string | null | undefined;
 public isGroup: boolean | undefined;
 public sudo: boolean;
 public mode: boolean;
 public user: (match?: string) => string | undefined;
 public messageTimestamp: number | Long.Long | null | undefined;
 public prefix: string[];

 constructor(data: Serialize, client: WASocket) {
  this.client = client;
  this.data = data;
  this.jid = data.jid;
  this.id = data.key.id;
  this.fromMe = data.key.fromMe;
  this.participant = data.key.participant;
  this.pushName = data.pushName;
  this.key = data.key;
  this.owner = data.owner;
  this.sender = data.sender;
  this.isGroup = data.isGroup;
  this.sudo = data.sudo;
  this.mode = data.mode as boolean;
  this.user = data.user;
  this.messageTimestamp = data.messageTimestamp ?? Date.now();
  this.prefix = data.prefix as string[];
 }

 async edit(text: string, key: WAMessageKey) {
  return await this.client.sendMessage(this.jid, { text, edit: key });
 }

 async delete(key: WAMessageKey) {
  const isRestrictedGroup = this.isGroup && !(await this.isBotAdmin());
  const isPrivateNotMe = !this.isGroup && !this.fromMe;

  if (isRestrictedGroup || isPrivateNotMe) {
   return await this.client.chatModify(
    {
     deleteForMe: {
      deleteMedia: isMediaMessage(this.data),
      key: key,
      timestamp: Date.now(),
     },
    },
    this.jid,
   );
  }
  return await this.client.sendMessage(this.jid, { delete: key });
 }

 async downloadM(message: WAMessage) {
  return await downloadMediaMessage(message, 'buffer', {});
 }

 async isAdmin(user: string) {
  const metadata = await this.client.groupMetadata(this.jid);
  const allAdmins = metadata.participants
   .filter((v) => v.admin !== null)
   .map((v) => v.id);
  return !Array.isArray(allAdmins)
   ? Array.from(allAdmins).includes(user)
   : allAdmins.includes(user);
 }

 async isBotAdmin() {
  const metadata = await this.client.groupMetadata(this.jid);
  const allAdmins = metadata.participants
   .filter((v) => v.admin !== null)
   .map((v) => v.id);
  return !Array.isArray(allAdmins)
   ? Array.from(allAdmins).includes(this.owner)
   : allAdmins.includes(this.owner);
 }

 async forward(jid: string, message: WAMessage, options?: WAContextInfo) {
  return await this.client.sendMessage(jid, {
   forward: message,
   contextInfo: { ...options },
  });
 }

 async react(emoji: string, key: WAMessageKey) {
  return await this.client.sendMessage(this.jid, {
   react: { text: emoji, key },
  });
 }
}
