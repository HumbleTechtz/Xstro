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
import sql_store from '../models/sql_store.ts';

export default async function () {
 const { state, saveCreds } = await useSqliteAuthState();
 const { version } = await fetchLatestBaileysVersion();
 const cache = new NodeCache();
 const logger = pino({ level: 'silent' });

 const sock = makeWASocket({
  auth: {
   creds: state.creds,
   keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  agent: config.PROXY ? new HttpsProxyAgent(config.PROXY) : undefined,
  logger,
  version,
  browser: Browsers.windows('chrome'),
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

 await Promise.all([
  new makeEvents(sock, { saveCreds }),
  socketHooks(sock),
  sql_store(sock),
 ]);
 return sock;
}
