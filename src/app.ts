import WhatsAppClient from './messaging/client.ts';
import { syncPlugins } from './messaging/plugins.ts';
import { print } from './utils/constants.ts';
import { disablelogs } from './utils/console.js';

export default class App {
 constructor() {
  this.init();
 }

 private async init() {
  try {
   disablelogs('libsignal');
   await syncPlugins('../plugins', ['.ts']);
   new WhatsAppClient();
  } catch (error) {
   print.fail(error as string);
  }
 }
}

new App();
