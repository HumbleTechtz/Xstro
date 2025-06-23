import { config } from "./client/Utils";

config({ path: [".env", "config.env"], override: true });

export default {
	USER_NUMBER: process.env.USER_NUMBER,
	OWNER_NAME: process.env.OWNER_NAME,
	BOT_NAME: process.env.BOT_NAME,
	PORT: Number(process.env.PORT ?? `8000`),
};
