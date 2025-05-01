import {
 makeWASocket,
 makeCacheableSignalKeyStore,
 Browsers,
 fetchLatestBaileysVersion,
 type WASocket,
} from 'baileys';
import NodeCache from '@cacheable/node-cache';
import config from '../../config.ts';
import makeEvents from './events.ts';
import {
 log as print,
 connectProxy,
 useSqliteAuthState,
} from '../utils/index.ts';
import {
 getMessage,
 cachedGroupMetadata,
 updateMetaGroup,
} from '../models/index.ts';

const proxy = config.PROXY_URI;

export default class WhatsAppClient {
 private sock: WASocket | undefined;
 private events: makeEvents | undefined;

 constructor() {
  this.sock = undefined;
  this.events = undefined;
  this.run();
  setInterval(async () => {
   try {
    if (this.sock) {
     const groups = await this.sock.groupFetchAllParticipating();
     if (!groups) return;

     for (const [jid, metadata] of Object?.entries(groups)) {
      await updateMetaGroup(jid, metadata);
     }
    }
   } catch (e) {}
  }, 600_000);
 }

 private async run() {
  const { state, saveCreds } = await useSqliteAuthState();
  const { version } = await fetchLatestBaileysVersion();
  const cache = new NodeCache();

  this.sock = makeWASocket({
   auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, print),
   },
   agent: proxy ? connectProxy(proxy) : undefined,
   logger: print,
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

  this.events = new makeEvents(this.sock, { saveCreds });
  return this.events;
 }
}
