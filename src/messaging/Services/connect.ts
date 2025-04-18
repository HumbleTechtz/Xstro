import pm2 from 'pm2';
import { DisconnectReason } from 'baileys';
import { Boom } from '@hapi/boom';
import config from '../../../config.ts';
import { log, parseJid } from '../../utils/index.ts';
import { setSudo } from '../../models/index.ts';
import type { BaileysEventMap, WASocket } from 'baileys';

export default class Connection {
 private client: WASocket;
 private events: BaileysEventMap['connection.update'];
 private isTerminating: boolean = false;

 constructor(client: WASocket, events: BaileysEventMap['connection.update']) {
  this.client = client;
  this.events = events;
  this.setupProcessHandlers();
  this.handleConnectionUpdate();
 }

 private setupProcessHandlers() {
  const cleanup = () => {
   if (!this.isTerminating) {
    this.isTerminating = true;
    log.info('Process terminating, cleaning up...');
    this.client.ev.flush();
    this.client.ws.close();
    process.exit(1);
   }
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('uncaughtException', (err) => {
   log.error(`Uncaught Exception: ${err.message}`);
   cleanup();
  });
  process.on('unhandledRejection', (reason) => {
   log.error(`Unhandled Rejection: ${reason}`);
   cleanup();
  });
 }

 public async handleConnectionUpdate() {
  if (this.isTerminating) return;
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
  if (this.isTerminating) return;
  log.info('Connecting to WhatsApp...');
  if (this.client.user?.id) {
   await setSudo(parseJid(this.client?.user?.id));
  }
 }

 private async handleClose(
  lastDisconnect?: BaileysEventMap['connection.update']['lastDisconnect'],
 ) {
  if (this.isTerminating) return;
  const error = lastDisconnect?.error as Boom;
  const statusCode = error?.output?.statusCode;

  if (statusCode === DisconnectReason.loggedOut) {
   log.info('Logged out, cleaning up...');
   this.client.ev.flush();
   await this.client.ws.close();
   process.exit(1);
  } else {
   log.info('Connection closed, attempting restart...');
   this.client.ev.flush();
   await this.client.ws.close();
   pm2.restart(config.PROCESS_NAME, async (error: Error) => {
    if (error) {
     log.error('Rebooting using process exitor');
     this.client.ev.flush();
     await this.client.ws.close();
     process.exit(1);
    }
   });
  }
 }

 private async handleOpen() {
  if (this.isTerminating) return;
  log.info('Connection Successful');
  if (this.client.user?.id) {
   await this.client.sendMessage(this.client.user.id, { text: 'Hello World' });
  }
 }
}
