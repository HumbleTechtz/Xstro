import { config } from "dotenv";

config({ path: [".env", "config.env"], override: true });

export default {
	USER_NUMBER: process.env.USER_NUMBER,
	OWNER_NAME: process.env.OWNER_NAME,
	BOT_NAME: process.env.BOT_NAME,
	API_KEY: process.env.API_KEY,
	PROXY: process.env.PROXY,
	PORT: Number(process.env.PORT ?? `8000`),
	DEBUG: Number(process.env.DEBUG ?? `0`),
};
