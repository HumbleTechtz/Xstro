import { Command } from '../../messaging/plugin.ts';
import { getLeaderboard } from '../../models/leaderboard.ts';

Command({
	name: 'leaderboard',
	fromMe: false,
	isGroup: false,
	desc: 'View the game leaderboard',
	type: 'games',
	function: async msg => {
		const lbEntries = await getLeaderboard();
		if (!lbEntries || lbEntries.length === 0) {
			await msg.send('No leaderboard data available.');
			return;
		}
		const formatted = lbEntries
			.map(
				(entry, idx) =>
					`${idx + 1}. @${entry.userId.split('@')[0]}: ${entry.score}`,
			)
			.join('\n');

		const userIds = lbEntries.map(entry => entry.userId);

		await msg.send(`🏆 Leaderboard 🏆\n\n${formatted}`, { mentions: userIds });
	},
});
