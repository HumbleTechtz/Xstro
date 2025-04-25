import Base from './Base.ts';
import type { Serialize } from '../../types/index.ts';
import type { WAMessageKey, WASocket } from 'baileys';

export default class ReplyMessage extends Base {
 public quoted: Serialize['quoted'];
 public key: WAMessageKey;
 public message: Serialize['message'];
 public mtype: Serialize['mtype'];
 public text: Serialize['text'];
 public broadcast: boolean | undefined;
 public sender: string | null | undefined;
 public image: boolean;
 public video: boolean;
 public audio: boolean;
 public sticker: boolean;
 public viewOnce: boolean | undefined;

 constructor(data: Serialize, client: WASocket) {
  super(data, client);
  this.quoted = data?.quoted;
  this.key = data.quoted?.key as WAMessageKey;
  this.message = data.quoted?.message;
  this.mtype = data.quoted?.type;
  this.text = data.quoted?.text;
  this.broadcast = data.quoted?.broadcast;
  this.sender = data.quoted?.sender;
  this.image = Boolean(data?.quoted?.message?.imageMessage);
  this.video = Boolean(data?.quoted?.message?.videoMessage);
  this.audio = Boolean(data?.quoted?.message?.audioMessage);
  this.sticker = Boolean(data?.quoted?.message?.stickerMessage);
  this.viewOnce = data?.quoted?.viewOnce;
 }

 async edit(text: string) {
  return await super.edit(text, this.key);
 }

 async delete() {
  return await super.delete(this.key);
 }

 async downloadM() {
  return await super.downloadM(this.quoted!);
 }

 async isAdmin() {
  return await super.isAdmin(this.sender!);
 }

 async isBotAdmin() {
  return await super.isBotAdmin();
 }

 async forward(jid: string) {
  return await super.forward(jid, this.quoted!);
 }

 async react(emoji: string) {
  return await super.react(emoji, this.key);
 }
}
