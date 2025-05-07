import {
 makeWASocket,
 makeCacheableSignalKeyStore,
 Browsers,
 fetchLatestBaileysVersion,
} from 'baileys';
import { pino } from 'pino';
import { HttpsProxyAgent } from 'https-proxy-agent';
import NodeCache from '@cacheable/node-cache';

import config from '../../config.ts';
import makeEvents from './events.ts';
import { useSqliteAuthState } from '../utils/index.ts';
import { getMessage, cachedGroupMetadata } from '../models/index.ts';
import { socketHooks } from './hooks.ts';
import { print } from '../utils/constants.ts';

export default async function () {
 print.info('⚙ Initializing WhatsApp client...');

 const { state, saveCreds } = await useSqliteAuthState();
 print.info('🔐 Loaded auth state');

 const { version } = await fetchLatestBaileysVersion();
 print.info(`📦 Using Baileys version: ${version.join('.')}`);

 const cache = new NodeCache();
 const logger = pino({ level: 'debug' });

 print.info('📶 Creating WASocket instance...');
 const sock = makeWASocket({
  auth: {
   creds: state.creds,
   keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  agent: config.PROXY ? new HttpsProxyAgent(config.PROXY) : undefined,
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

 print.info('🔗 Setting up event handlers and hooks...');
 await Promise.all([new makeEvents(sock, { saveCreds }), socketHooks(sock)]);

 print.info('✅ WhatsApp client initialized successfully.');
 return sock;
}
