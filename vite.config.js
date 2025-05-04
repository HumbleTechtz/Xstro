import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
 root: path.resolve(__dirname, './web/'),
});
