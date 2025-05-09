import client from './messaging/client.ts';
import { syncPlugins } from './messaging/plugins.ts';
import { print } from './utils/constants.ts';

export async function startApp() {
 await syncPlugins('../plugins', ['.ts']);
 await client();
}

startApp();
