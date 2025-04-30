import { getAntiword } from '../../models/antiword.ts';
import Message from '../Messages/Message.ts';
import type { MessageMisc } from '../../types/bot.ts';
import type { AnyMessageContent, WAMessage } from 'baileys';

export default class AntiWord {
 public jid: string;
 public isGroup: boolean | undefined;
 public text: string | null | undefined;
 public sender: string | null | undefined;
 public owner: string;
 public isBotAdmin: () => Promise<boolean>;
 public isAdmin: (user: string) => Promise<boolean>;
 public delete: () => Promise<void | WAMessage>;
 public send: (
  content: string | Buffer,
  options?: MessageMisc & Partial<AnyMessageContent>,
 ) => Promise<Message>;

 constructor(instance: Message) {
  this.jid = instance.data.jid;
  this.isGroup = instance.isGroup;
  this.text = instance?.data?.text;
  this.sender = instance.sender;
  this.owner = instance.owner;
  this.isBotAdmin = instance.isBotAdmin;
  this.isAdmin = instance.isAdmin;
  this.delete = instance.delete;
  this.send = instance.send;
  this.handleEvent();
 }

 private async handleEvent() {
  if (!this.isGroup) return;

  const config = await getAntiword(this.jid);
  const state = config?.status;

  if (!state) return;
  if (this.sender === this.owner) return;
  if ((await this.isAdmin(this.sender!)) || !(await this.isBotAdmin())) return;

  const words = config.words as string[];
  if (!this.text || !words || words.length === 0) return;

  const loweredText = this.text.toLowerCase().trim();
  const matched = words.filter((w) => loweredText.includes(w.toLowerCase()));

  if (matched.length > 0) {
   await this.delete();
   await this.send(
    `_@${this.sender?.split('@')[0]} your message has been deleted for using a prohibted word_`,
   );
  }
 }
}
