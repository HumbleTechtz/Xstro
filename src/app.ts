import client from './messaging/client.ts';
import { syncPlugins } from './messaging/plugins.ts';
import { print } from './utils/constants.ts';

export async function startApp() {
 try {
  await syncPlugins('../plugins', ['.ts']);
  await client();
 } catch (error) {
  print.fail(error as string);
 }
}

startApp();
