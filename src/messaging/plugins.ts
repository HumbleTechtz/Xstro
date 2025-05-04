import { pathToFileURL, fileURLToPath } from 'node:url';
import { join, extname, dirname } from 'node:path';
import { readdir } from 'node:fs/promises';
import { print } from '../utils/index.ts';
import type { Commands } from '../types/bot.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const commands: Commands[] = [];

export function Command(cmd: Commands) {
 const _cmds = {
  ...cmd,
  name: new RegExp(`^\\s*(${cmd.name})(?:\\s+([\\s\\S]+))?$`, 'i'),
 };
 return commands.push(_cmds);
}

export async function syncPlugins(
 plugin: string,
 extensions: string[] = ['.ts'],
): Promise<void> {
 const plugins = join(__dirname, plugin);

 const files = await readdir(plugins, { withFileTypes: true });
 await Promise.all(
  files.map(async (file) => {
   const fullPath: string = join(plugins, file.name);
   const fileExtension = extname(file.name).toLowerCase();
   if (extensions.some((ext) => ext.toLowerCase() === fileExtension)) {
    try {
     const fileUrl: string = pathToFileURL(fullPath).href;
     await import(fileUrl);
    } catch (err) {
     print.fail(`${file.name}: ${(err as Error).message}`);
    }
   }
  }),
 );
}
