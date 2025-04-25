import {
 makeWASocket,
 makeCacheableSignalKeyStore,
 Browsers,
 WASocket,
} from 'baileys';
import config from '../config.ts';
import makeEvents from './messaging/_process.ts';
import { log, connectProxy, useSqliteAuthStore } from './utils/index.ts';
import { getMessage, cachedGroupMetadata } from './models/index.ts';

export class WhatsAppClient {
 private sock: WASocket | undefined;
 private events: makeEvents | undefined;

 constructor() {
  this.sock = undefined;
  this.events = undefined;
  this.initialize();
 }

 public async initialize() {
  const { state, saveCreds } = await useSqliteAuthStore();

  this.sock = makeWASocket({
   auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, log),
   },
   agent: config.PROXY_URI ? connectProxy(config.PROXY_URI) : undefined,
   logger: log,
   browser: Browsers.windows('Chrome'),
   emitOwnEvents: true,
   generateHighQualityLinkPreview: true,
   linkPreviewImageThumbnailWidth: 1920,
   getMessage,
   cachedGroupMetadata,
  });

  this.events = new makeEvents(this.sock, { saveCreds });
  return this.events;
 }

 public getSocket() {
  return this.sock;
 }

 public getEvents() {
  return this.events;
 }
}
