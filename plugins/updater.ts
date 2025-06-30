import { restart, update } from "../core/Utils";
import type { CommandModule } from "../core/Core";

export default [
	{
		pattern: "update",
		fromMe: true,
		isGroup: false,
		desc: "Update the bot and dependencies",
		type: "utilities",
		run: async (message, match) => {
			const prefix = message.prefix[0];
			const result = (await update(match === "now")) as {
				status: "up-to-date" | "updates-available" | "updated" | "error";
				commits?: string[];
				error?: string;
			};

			switch (result.status) {
				case "up-to-date":
					await message.send("```You are on the latest version```");
					break;
				case "updates-available":
					const commitMessages = result
						?.commits!.map(commit => {
							const lines = commit.split("\n");
							const messageLine = lines.find(line => line.startsWith("    "));
							return messageLine ? messageLine.trim() : "";
						})
						.filter(Boolean);

					let changes = "New update available\n\n";
					changes += `Fixes: ${commitMessages.length}\nDetails:\n`;
					commitMessages.forEach((message, index) => {
						changes += `${index + 1}. ${message}\n`;
					});
					changes += "To apply the update, use: " + prefix + "update now";
					await message.send("```" + changes + "```");
					break;
				case "updated":
					await message.send("Updating...");
					restart();
					break;
				case "error":
					await message.send("Update failed:\n```" + result.error + "```");
					break;
			}
		},
	},
] satisfies CommandModule[];
