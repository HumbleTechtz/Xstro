import util from "util";
import { CommandModule } from "@types";

export default {
	on: "eval",
	handler: async message => {
		const text = message.text;

		if (text?.startsWith("$") || text?.startsWith(">")) {
			try {
				const result = await eval(`(async () => { ${text.slice(2)} })()`);
				await message.send(util.inspect(result, { depth: 2 }));
			} catch (error) {
				await message.send(util.inspect(error, { depth: 2 }));
			}
		}
	},
} satisfies CommandModule;
