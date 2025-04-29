import WhatsAppClient from './messaging/client.ts';
import { syncPlugins } from './messaging/plugins.ts';
import { SessionManager } from './utils/migrate.ts';
import { log } from './utils/logger.ts';
import { parseModules } from './utils/constants.ts';

export default class App {
 constructor() {
  this.init();
 }

 private async init() {
  try {
   await parseModules();
   await syncPlugins('../plugins', ['.ts']);
   new SessionManager();
   new WhatsAppClient();
  } catch (error) {
   log.error(error);
  }
 }
}

new App();
