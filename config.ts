import { config } from "dotenv";

config({ override: true, path: ["config.env", ".env"] });

export default {
	NUMBER: process.env.NUMBER || "",
	PAIR_CODE: process.env.PAIR_CODE || undefined,
};
