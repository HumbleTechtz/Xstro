import { Pool } from 'pg';

const pool = new Pool({
	connectionString:
		'postgres://avnadmin:AVNS_DAiFNxk2X8X53ZcL89G@leaderboard-leaderboard-whatsappbot.e.aivencloud.com:17564/defaultdb',
	ssl: {
		rejectUnauthorized: false,
	},
	keepAlive: true,
});

async function PostgreDB() {
	await pool.query(`
        CREATE TABLE IF NOT EXISTS leaderboard (
            userId VARCHAR(255) PRIMARY KEY,
            score INTEGER NOT NULL,
            rank VARCHAR(50) NOT NULL DEFAULT 'bronze'
        );
    `);
}

PostgreDB().catch(console.error);

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
	// Get current leaderboard
	const { rows: currentLeaderboard } = await pool.query(
		'SELECT * FROM leaderboard',
	);
	const dbMap = new Map(currentLeaderboard.map(u => [u.userId, u]));

	const top3 = [...users]
		.sort((a, b) => b.score - a.score)
		.slice(0, 3)
		.map(u => u.userId);

	const updated = new Set<string>();

	// Process updates
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
			await pool.query(
				'UPDATE leaderboard SET score = $1, rank = $2 WHERE userId = $3',
				[finalScore, newRank, user.userId],
			);
		} else {
			await pool.query(
				'INSERT INTO leaderboard (userId, score, rank) VALUES ($1, $2, $3)',
				[user.userId, finalScore, newRank],
			);
		}

		updated.add(user.userId);
	}

	// Apply penalties for inactive high-rank users
	for (const entry of currentLeaderboard) {
		if (typeof entry.userId === 'string' && !updated.has(entry.userId)) {
			const rank = entry.rank;
			if (['legend', 'master', 'diamond'].includes(String(rank))) {
				const penaltyMultiplier = 0.75;
				const score = typeof entry.score === 'number' ? entry.score : 0;
				const penalizedScore = Math.floor(score * penaltyMultiplier);
				const newRank = determineRank(penalizedScore);
				await pool.query(
					'UPDATE leaderboard SET score = $1, rank = $2 WHERE userId = $3',
					[penalizedScore, newRank, entry.userId],
				);
			}
		}
	}

	// Return sorted leaderboard
	const { rows: updatedLeaderboard } = await pool.query(
		'SELECT * FROM leaderboard ORDER BY score DESC, userId ASC',
	);
	return updatedLeaderboard.map(u => ({
		userId: u.userid,
		score: u.score,
		rank: u.rank,
	}));
}

async function resetLeaderboard() {
	await pool.query("UPDATE leaderboard SET score = 0, rank = 'bronze'");
}

async function getLeaderboard(): Promise<
	{
		userId: string;
		score: number;
		rank: string;
	}[]
> {
	const { rows } = await pool.query(
		'SELECT * FROM leaderboard ORDER BY score DESC, userId ASC',
	);
	return rows.map(u => ({
		userId: String(u.userid ?? ''),
		score: Number(u.score ?? 0),
		rank: String(u.rank ?? 'bronze'),
	}));
}

export { updateLeaderboard, resetLeaderboard, UserRank, getLeaderboard };
