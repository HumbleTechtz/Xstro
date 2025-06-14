import { config } from 'dotenv';

config({ path: ['.env', 'config.env'], override: true });

/**
 * Loads environment variables for configuration.
 *
 * @remarks
 * - On a local PC, create a `.env` file and fill in the required variables.
 * - On deployment platforms (e.g., Vercel, Railway, etc.), the platform typically allows you to configure these.
 * - All variables except `USER_NUMBER` can be ignored unless you know what you’re doing.
 */
export default {
	USER_NUMBER: process.env.USER_NUMBER,
	OWNER_NAME: process.env.OWNER_NAME,
	BOT_NAME: process.env.BOT_NAME,
	API_KEY: process.env.API_KEY,
	PROXY: process.env.PROXY,
	PORT: parseInt(process.env.PORT ?? `8000`),
	DEBUG: parseInt(process.env.DEBUG ?? `0`),
};
