import Message from '../Messages/Message.ts';
import { log } from '../../utils/index.ts';
import { commands } from '../plugins.ts';
import { CONDITIONS } from '../../enum/index.ts';
import type { Commands } from '../../types/index.ts';

export default class RunCommand {
 private message: Message;
 private text: string | null | undefined;
 private prefix: string[];

 constructor(message: Message) {
  this.message = message;
  this.text = message.data.text;
  this.prefix = message.data.prefix;
  this.run();
  this.runSticker();
 }

 private async run(): Promise<void> {
  if (!this.text) return;

  for (const cmd of commands) {
   const handler =
    this.prefix.find((p: string) => this.text?.startsWith(p)) ?? '';
   const match = this.text
    .slice(handler?.length || 0)
    .match(cmd.name as string);

   if (!handler || !match) continue;
   if (!this.checkBeforeCommandExecution(cmd)) continue;

   try {
    await this.message.react('⏳');
    await cmd.function(this.message, match[2] ?? '');
   } catch (err) {
    log.error(err);
   }
  }
 }

 private async runSticker(): Promise<void> {
  // to do : sticker command
 }

 private checkBeforeCommandExecution(cmd: Commands): boolean {
  if (this.message.mode && !this.message.sudo) return false;
  if (cmd.fromMe && !this.message.sudo) {
   this.message.send(CONDITIONS.FOR_SUDO_USERS);
   return false;
  }
  if (cmd.isGroup && !this.message.isGroup) {
   this.message.send(CONDITIONS.FOR_GROUPS_ONLY);
   return false;
  }
  return true;
 }
}
