import client from './messaging/client.ts';
import { syncPlugins } from './messaging/plugins.ts';

export async function startApp() {
 try {
  await syncPlugins('../plugins', ['.ts']);
  await client();
 } catch (error) {
  console.log(error);
 }
}

startApp();
