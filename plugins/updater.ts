import { Command } from "../src/Core/plugin.ts";
import { restart } from "../src/Utils/constants.ts";
import { update } from "../src/Utils/updater.ts";

Command({
	name: "update",
	fromMe: true,
	isGroup: false,
	desc: "Update the bot and dependencies",
	type: "utilities",
	function: async (message, match) => {
		const prefix = message.prefix[0];
		const result = await update(match === "now");

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
});
