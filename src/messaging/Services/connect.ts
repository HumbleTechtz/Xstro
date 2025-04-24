import { Boom } from '@hapi/boom';
import { DisconnectReason } from 'baileys';
import { commands } from '../plugins.ts';
import { getSettings, setSettings } from '../../models/index.ts';
import { log, parseJid } from '../../utils/index.ts';
import type { BaileysEventMap, WASocket } from 'baileys';

export default class Connection {
 private client: WASocket;
 private events: BaileysEventMap['connection.update'];
 constructor(client: WASocket, events: BaileysEventMap['connection.update']) {
  this.client = client;
  this.events = events;
  this.handleConnectionUpdate();
 }
 public async handleConnectionUpdate() {
  const { connection, lastDisconnect } = this.events;
  switch (connection) {
   case 'connecting':
    await this.handleConnecting();
    break;
   case 'close':
    await this.handleClose(lastDisconnect);
    break;
   case 'open':
    await this.handleOpen();
    break;
  }
 }
 private async handleConnecting() {
  log.info('Connecting to WhatsApp...');
  if (this.client.user?.id) {
   const sudo = (await getSettings()).sudo ?? [];
   await setSettings(
    'sudo',
    Array.from(
     new Set([parseJid(this.client?.user?.id), ...(sudo as string[])]),
    ),
   );
  }
 }
 private async handleClose(
  lastDisconnect?: BaileysEventMap['connection.update']['lastDisconnect'],
 ) {
  const error = lastDisconnect?.error as Boom;
  const statusCode = error?.output?.statusCode;

  if (statusCode === DisconnectReason.loggedOut) {
   this.client.ev.flush(true);
   await this.client.ws.close();
   process.exit(1);
  }
 }
 private async handleOpen() {
  log.info('Connection Successful');
  const cmdsList = commands.filter((cmd) => !cmd.dontAddCommandList);

  if (this.client?.user?.id) {
   await this.client.sendMessage(this.client.user.id, {
    text:
     `\`\`\`Bot is connected\nOwner: ${this.client.user.name ?? 'Unknown'}\nCommands: ${cmdsList.length}\`\`\``.trim(),
   });
  }
 }
}
