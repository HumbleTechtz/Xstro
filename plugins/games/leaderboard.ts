import { delay } from "baileys";
import { Command } from "../../src/Core/plugin.ts";
import { getLeaderboard } from "../../src/Models/leaderboard.ts";

Command({
	name: "leaderboard",
	fromMe: false,
	isGroup: false,
	desc: "View the game leaderboard",
	type: "games",
	function: async msg => {
		await msg.send(`_Most Users are Hidden for Privacy Reasons_`);
		await delay(3000);
		const lbEntries = await getLeaderboard();
		if (!lbEntries || lbEntries.length === 0) {
			await msg.send("No leaderboard data available.");
			return;
		}

		const rankOrder = [
			"legend",
			"master",
			"diamond",
			"platinum",
			"gold",
			"silver",
			"bronze",
		];
		lbEntries.sort((a, b) => {
			const rankDiff = rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
			return rankDiff !== 0 ? rankDiff : b.score - a.score;
		});

		const legends = lbEntries.filter(e => e.rank === "legend");
		const master = lbEntries.filter(e => e.rank === "master");
		const diamond = lbEntries.filter(e => e.rank === "diamond");
		const platinum = lbEntries.filter(e => e.rank === "platinum");
		const gold = lbEntries.filter(e => e.rank === "gold");
		const silver = lbEntries.filter(e => e.rank === "silver");
		const bronze = lbEntries.filter(e => e.rank === "bronze");

		const legendsText =
			legends.length > 0
				? `Legends:\n${legends.map((e, i) => `${i + 1}. @${e.userId.split("@")[0]}: ${e.score}`).join("\n")}\n`
				: "Legends:\n---\n";

		const masterText =
			master.length > 0
				? `Master:\n${master.map((e, i) => `${i + 1}. @${e.userId.split("@")[0]}: ${e.score}`).join("\n")}\n`
				: "Master:\n---\n";

		const diamondText =
			diamond.length > 0
				? `Diamond:\n${diamond.map((e, i) => `${i + 1}. @${e.userId.split("@")[0]}: ${e.score}`).join("\n")}\n`
				: "Diamond:\n---\n";

		const platinumText =
			platinum.length > 0
				? `Platinum:\n${platinum.map((e, i) => `${i + 1}. @${e.userId.split("@")[0]}: ${e.score}`).join("\n")}\n`
				: "Platinum:\n---\n";

		const goldText =
			gold.length > 0
				? `Gold:\n${gold.map((e, i) => `${i + 1}. @${e.userId.split("@")[0]}: ${e.score}`).join("\n")}\n`
				: "Gold:\n---\n";

		const silverText =
			silver.length > 0
				? `Silver:\n${silver.map((e, i) => `${i + 1}. @${e.userId.split("@")[0]}: ${e.score}`).join("\n")}\n`
				: "Silver:\n---\n";

		const bronzeText =
			bronze.length > 0
				? `Bronze:\n${bronze.map((e, i) => `${i + 1}. @${e.userId.split("@")[0]}: ${e.score}`).join("\n")}\n`
				: "Bronze:\n---\n";

		const formatted = `LeaderBoard\n\n${legendsText}${masterText}${diamondText}${platinumText}${goldText}${silverText}${bronzeText}`;

		const userIds = lbEntries.map(entry => entry.userId);

		await msg.send("```" + formatted + "```", { mentions: userIds });
	},
});
