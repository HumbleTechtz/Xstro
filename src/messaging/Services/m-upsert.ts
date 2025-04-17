import Message from '../Messages/Message.ts';
import { log } from '../../utils/index.ts';
import { messageDb } from '../../models/index.ts';
import { serialize } from '../serialize.ts';
import { commands } from '../plugins.ts';
import type { BaileysEventMap, WASocket } from 'baileys';

export default class MessageUpsert {
 private client: WASocket;
 private upserts: BaileysEventMap['messages.upsert'];

 constructor(client: WASocket, upserts: BaileysEventMap['messages.upsert']) {
  this.client = client;
  this.upserts = upserts;
  this.queueAll();
 }

 public async queueAll() {
  for (const message of this.upserts.messages) {
   try {
    const msg = await serialize(this.client, structuredClone(message));
    const cmdInstance = new Message(msg, this.client);
    await Promise.all([
     await messageDb.create({
      id: message?.key?.id ?? null,
      message,
     }),

     await this.runCommand(cmdInstance),
    ]);
   } catch (error) {
    log.error(`Task error: ${error}`);
   }
  }
 }

 async runCommand(message: Message) {
  if (!message.data.text) return;

  for (const cmd of commands) {
   const handler = message.data.prefix.find((p: string) =>
    message.data.text?.startsWith(p),
   );
   const match = message.data.text
    .slice(handler?.length || 0)
    .match(cmd.name as string);
   if (!handler || !match) continue;

   if (message.mode && !message.sudo) continue;
   if (cmd.fromMe && !message.sudo) {
    await message.send('_This command is for Sudo Only!_');
    continue;
   }
   if (cmd.isGroup && !message.isGroup) {
    await message.send('_This command is for Groups Only!_');
    continue;
   }

   try {
    await message.react('⏳');
    await cmd.function(message, match[2] ?? '');
   } catch (err) {
    log.error(err);
   }
  }
 }
}
