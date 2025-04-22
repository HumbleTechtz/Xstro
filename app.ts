import { WhatsAppClient } from './src/client.ts';
import { syncPlugins } from './src/messaging/plugins.ts';
import { SessionManager } from './src/utils/migrate.ts';
import { log } from './src/utils/logger.ts';

class App {
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
