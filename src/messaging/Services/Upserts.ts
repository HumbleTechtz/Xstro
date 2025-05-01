import Message from '../Messages/Message.ts';
import RunCommand from './Commands.ts';
import { serialize } from '../serialize.ts';
import type { BaileysEventMap, WASocket } from 'baileys';

export default class MessageUpsert {
 private client: WASocket;
 private msg: BaileysEventMap['messages.upsert'];

 constructor(client: WASocket, upserts: BaileysEventMap['messages.upsert']) {
  this.client = client;
  this.msg = upserts;
  this.msgHooks();
 }

 private async msgHooks(): Promise<void> {
  for (const msg of this.msg.messages) {
   const cloned = structuredClone(msg);
   const serialized = await serialize(this.client, cloned);
   const instance = new Message(serialized, this.client);

   await Promise.all([new RunCommand(instance)]);
  }
 }
}
