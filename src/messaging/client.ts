import {
 makeWASocket,
 makeCacheableSignalKeyStore,
 Browsers,
 fetchLatestBaileysVersion,
 type WASocket,
} from 'baileys';
import pino from 'pino';
import { HttpsProxyAgent } from 'https-proxy-agent';
import NodeCache from '@cacheable/node-cache';
import config from '../../config.ts';
import makeEvents from './events.ts';
import { useSqliteAuthState } from '../utils/index.ts';
import { getMessage, cachedGroupMetadata } from '../models/index.ts';
import { socketHooks } from './hooks.ts';

export default class WhatsAppClient {
 private sock: WASocket | undefined;

 constructor() {
  this.sock = undefined;
  this.run();
 }

 private async run() {
  const { state, saveCreds } = await useSqliteAuthState();
  const { version } = await fetchLatestBaileysVersion();
  const cache = new NodeCache();
  const logger = pino.default({ level: 'debug' });

  this.sock = makeWASocket({
   auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
   },
   agent: new HttpsProxyAgent(config.PROXY_URI),
   logger,
   version,
   browser: Browsers.windows('Chrome'),
   emitOwnEvents: true,
   generateHighQualityLinkPreview: true,
   linkPreviewImageThumbnailWidth: 1920,
   msgRetryCounterCache: cache,
   mediaCache: cache,
   userDevicesCache: cache,
   callOfferCache: cache,
   getMessage,
   cachedGroupMetadata,
  });

  Promise.all([
   new makeEvents(this.sock, { saveCreds }),
   socketHooks(this.sock),
  ]);
 }
}
