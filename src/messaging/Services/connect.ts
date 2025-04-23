import pm2 from 'pm2';
import { Boom } from '@hapi/boom';
import { DisconnectReason } from 'baileys';
import config from '../../../config.ts';
import { commands } from '../plugins.ts';
import { setSudo } from '../../models/index.ts';
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
   await setSudo(parseJid(this.client?.user?.id));
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
  } else {
   pm2.restart(config.PROCESS_NAME, async (error: Error) => {
    if (error) {
     log.error('Rebooting using process exitor');
     process.exit();
    }
   });
  }
 }
 private async handleOpen() {
  log.info('Connection Successful');
  const cmdsList = commands.filter((cmd) => cmd.dontAddCommandList);

  if (this.client?.user?.id) {
   await this.client.sendMessage(this.client.user.id, {
    text:
     `\`\`\`Bot is connected\nOwner: ${this.client.user.name ?? 'Unknown'}\nCommands: ${cmdsList.length}\`\`\``.trim(),
   });
  }
 }
}