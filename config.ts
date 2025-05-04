import { config } from 'dotenv';
import type { AppConfig } from './src/types/bot.ts';

config();

export default {
 NUMBER: process.env.NUMBER ?? '',
 DATABASE: process.env.DATABASE ?? 'database.db',
 PROXY_URI: process.env.PROXY_URI ?? '',
 LOGGER: process.env.LOG_LEVEL ?? 'debug',
 PROCESS_NAME: process.env.PROCESS_NAME ?? 'xstro',
 DEBUG: process.env.DEBUG ?? 0,
} as AppConfig;
