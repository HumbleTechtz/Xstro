import http from 'http';
import WhatsAppClient from './messaging/client.ts';
import { syncPlugins } from './messaging/plugins.ts';
import { print } from './utils/constants.ts';
import { disablelogs } from './utils/console.js';

const PORT = 8000;

http
 .createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Alive.\n');
 })
 .listen(PORT, () => {
  print.succeed(`Connected to PORT: ${PORT}`);
 });

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
