import Message from '../Messages/Message.ts';
import RunCommand from '../Utils/RunCommand.ts';
import { serialize } from '../serialize.ts';
import type { BaileysEventMap, WASocket } from 'baileys';

export default class MessageUpsert {
 private client: WASocket;
 private msg: BaileysEventMap['messages.upsert'];

 constructor(client: WASocket, upserts: BaileysEventMap['messages.upsert']) {
  this.client = client;
  this.msg = upserts;
  this.run();
 }

 private async run() {
  new RunCommand(
   new Message(
    await serialize(this.client, structuredClone(this.msg?.messages?.[0]!)),
    this.client,
   ),
  );
 }
}
