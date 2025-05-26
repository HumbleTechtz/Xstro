import { DataType } from 'quantava';
import database from '../messaging/database.ts';

const leaderboard = database.define('leaderboard', {
	userId: { type: DataType.STRING, allowNull: false, unique: true },
	score: { type: DataType.INTEGER, allowNull: false },
	rank: { type: DataType.STRING, allowNull: false, defaultValue: 'bronze' },
});

enum UserRank {
	LEGEND = 1,
	MASTER = 2,
	DIAMOND = 3,
	PLATINUM = 4,
	GOLD = 5,
	SILVER = 6,
	BRONZE = 7,
}

const SCORE_THRESHOLDS = {
	LEGEND: 7000,
	MASTER: 5400,
	DIAMOND: 3200,
	PLATINUM: 800,
	GOLD: 600,
	SILVER: 500,
	BRONZE: 0,
};

const RANK_STRINGS: { [key in UserRank]: string } = {
	[UserRank.LEGEND]: 'legend',
	[UserRank.MASTER]: 'master',
	[UserRank.DIAMOND]: 'diamond',
	[UserRank.PLATINUM]: 'platinum',
	[UserRank.GOLD]: 'gold',
	[UserRank.SILVER]: 'silver',
	[UserRank.BRONZE]: 'bronze',
};

function rankToEnum(rank: string): UserRank {
	return (
		(Object.entries(RANK_STRINGS).find(
			([, v]) => v === rank,
		)?.[0] as unknown as UserRank) || UserRank.BRONZE
	);
}

function determineRank(score: number): string {
	if (score >= SCORE_THRESHOLDS.LEGEND) return 'legend';
	if (score >= SCORE_THRESHOLDS.MASTER) return 'master';
	if (score >= SCORE_THRESHOLDS.DIAMOND) return 'diamond';
	if (score >= SCORE_THRESHOLDS.PLATINUM) return 'platinum';
	if (score >= SCORE_THRESHOLDS.GOLD) return 'gold';
	if (score >= SCORE_THRESHOLDS.SILVER) return 'silver';
	return 'bronze';
}

async function updateLeaderboard(users: { userId: string; score: number }[]) {
	const currentLeaderboard = await leaderboard.findAll();
	const dbMap = new Map(currentLeaderboard.map(u => [u.userId, u]));

	const top3 = [...users]
		.sort((a, b) => b.score - a.score)
		.slice(0, 3)
		.map(u => u.userId);

	const updated = new Set<string>();

	for (const user of users) {
		const entry = dbMap.get(user.userId);
		const currentScore = typeof entry?.score === 'number' ? entry.score : 0;
		const currentRank = entry?.rank || 'bronze';

		let roundScore = user.score;

		if (top3.includes(user.userId)) {
			roundScore *= 1.02;
			console.log(`Top 3 boost applied to ${user.userId}: +2%`);
		}

		if (['legend', 'master', 'diamond'].includes(String(currentRank))) {
			roundScore *= 1.05;
			console.log(`High-rank boost applied to ${user.userId}: +5%`);
		}

		let finalScore;
		if (top3.includes(user.userId)) {
			finalScore = currentScore + Math.floor(roundScore);
		} else {
			finalScore = currentScore + Math.floor(roundScore * 0.92);
		}

		finalScore = Math.max(finalScore, 0);
		const newRank = determineRank(finalScore);

		if (entry) {
			await leaderboard.update(
				{ score: finalScore, rank: newRank },
				{ where: { userId: user.userId } },
			);
		} else {
			await leaderboard.create({
				userId: user.userId,
				score: finalScore,
				rank: newRank,
			});
		}

		updated.add(user.userId);
	}

	for (const entry of currentLeaderboard) {
		if (typeof entry.userId === 'string' && !updated.has(entry.userId)) {
			const rank = entry.rank;
			if (['legend', 'master', 'diamond'].includes(String(rank))) {
				const penaltyMultiplier = 0.75;
				const score = typeof entry.score === 'number' ? entry.score : 0;
				const penalizedScore = Math.floor(score * penaltyMultiplier);
				const newRank = determineRank(penalizedScore);
				await leaderboard.update(
					{ score: penalizedScore, rank: newRank },
					{ where: { userId: entry.userId } },
				);
			}
		}
	}

	const updatedLeaderboard = await leaderboard.findAll();
	return updatedLeaderboard
		.map(u => ({ userId: u.userId, score: u.score, rank: u.rank }))
		.sort(
			(a, b) =>
				(typeof b.score === 'number' ? b.score : 0) -
					(typeof a.score === 'number' ? a.score : 0) ||
				String(a.userId).localeCompare(String(b.userId)),
		);
}

async function resetLeaderboard() {
	await leaderboard.update({ score: 0, rank: 'bronze' }, { where: {} });
}

async function getLeaderboard(): Promise<
	{
		userId: string;
		score: number;
		rank: string;
	}[]
> {
	const leaderboardEntries = await leaderboard.findAll();
	return leaderboardEntries
		.map(u => ({
			userId: String(u.userId ?? ''),
			score: Number(u.score ?? 0),
			rank: String(u.rank ?? 'bronze'),
		}))
		.sort(
			(a, b) =>
				(typeof b.score === 'number' ? b.score : 0) -
					(typeof a.score === 'number' ? a.score : 0) ||
				String(a.userId).localeCompare(String(b.userId)),
		);
}

export {
	leaderboard,
	updateLeaderboard,
	resetLeaderboard,
	UserRank,
	getLeaderboard,
};
