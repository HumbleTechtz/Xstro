import { WhatsAppClient } from './client.ts';
import { syncPlugins } from './messaging/plugins.ts';
import { SessionManager } from './utils/migrate.ts';
import { log } from './utils/logger.ts';

export default class App {
 constructor() {
  this.init();
 }

 private async init() {
  try {
   await syncPlugins('../plugins', ['.mjs', '.mts']);
   new SessionManager();
   new WhatsAppClient();
  } catch (error) {
   log.error(error);
  }
 }
}

new App();
