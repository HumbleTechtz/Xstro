import util from "util";
import type { CommandModule } from "src/Types";

export default {
	on: "eval",
	dontAddCommandList: true,
	handler: async message => {
		if (!message.text) return;

		if (message.text.startsWith("$ ") || message.text.startsWith("> ")) {
			const code = message.text.slice(2);

			try {
				let result = await eval(`(async () => { ${code} })()`);
				if (typeof result !== "string") {
					result = util.inspect(stripFunctions(result), { depth: 2 });
				}
				await message.send("```\n" + result + "\n```");
			} catch (error) {
				await message.send("```\n" + error + "\n```");
			}
		}
	},
} satisfies CommandModule;

function stripFunctions(obj: any) {
	return JSON.parse(
		JSON.stringify(obj, (key, value) => {
			if (typeof value === "function") return undefined;
			return value;
		})
	);
}
