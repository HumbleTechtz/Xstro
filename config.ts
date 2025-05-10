import { config } from 'dotenv';

config();

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
	BOT_NAME: process.env.BOT_NAME,
	API_KEY: process.env.API_KEY,
	PORT: process.env.PORT,
	PROXY: process.env.PROXY,
	DEBUG: Number(process.env.DEBUG),
};
