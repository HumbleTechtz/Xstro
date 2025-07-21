import { Pool } from "pg";

const pool = new Pool({
	connectionString:
		"postgres://avnadmin:AVNS_DAiFNxk2X8X53ZcL89G@leaderboard-leaderboard-whatsappbot.e.aivencloud.com:17564/defaultdb",
	ssl: {
		rejectUnauthorized: false,
	},
	keepAlive: true,
});

const SCORE_THRESHOLDS = {
	legend: 7000,
	master: 5400,
	diamond: 3200,
	platinum: 800,
	gold: 600,
	silver: 500,
	bronze: 0,
};

const HIGH_RANKS = ["legend", "master", "diamond"];

await pool
	.query(
		`
		CREATE TABLE IF NOT EXISTS leaderboard (
			userid VARCHAR(255) PRIMARY KEY,
			score INTEGER NOT NULL,
			rank VARCHAR(50) NOT NULL DEFAULT 'bronze'
		)
	`
	)
	.catch(console.error);

function determineRank(score: number): string {
	if (score >= SCORE_THRESHOLDS.legend) return "legend";
	if (score >= SCORE_THRESHOLDS.master) return "master";
	if (score >= SCORE_THRESHOLDS.diamond) return "diamond";
	if (score >= SCORE_THRESHOLDS.platinum) return "platinum";
	if (score >= SCORE_THRESHOLDS.gold) return "gold";
	if (score >= SCORE_THRESHOLDS.silver) return "silver";
	return "bronze";
}

export async function updateLeaderboard(
	users: { userId: string; score: number }[]
) {
	const { rows: currentLeaderboard } = await pool.query(
		"SELECT userid, score, rank FROM leaderboard"
	);
	const dbMap = new Map(currentLeaderboard.map(u => [u.userid, u]));

	const top3 = [...users]
		.sort((a, b) => b.score - a.score)
		.slice(0, 3)
		.map(u => u.userId);

	for (const user of users) {
		const entry = dbMap.get(user.userId) as
			| { userid: string; score: number; rank: string }
			| undefined;
		const currentScore = entry?.score || 0;
		const currentRank = entry?.rank || "bronze";

		let roundScore = user.score;

		if (top3.includes(user.userId)) roundScore *= 1.02;
		if (HIGH_RANKS.includes(currentRank)) roundScore *= 1.05;

		let finalScore;
		if (top3.includes(user.userId)) {
			finalScore = currentScore + Math.floor(roundScore);
		} else {
			const penaltyMultiplier = HIGH_RANKS.includes(currentRank) ? 0.85 : 0.92;
			finalScore = currentScore + Math.floor(roundScore * penaltyMultiplier);
		}

		finalScore = Math.max(finalScore, 0);
		const newRank = determineRank(finalScore);

		if (entry) {
			await pool.query(
				"UPDATE leaderboard SET score = $1, rank = $2 WHERE userid = $3",
				[finalScore, newRank, user.userId]
			);
		} else {
			await pool.query(
				"INSERT INTO leaderboard (userid, score, rank) VALUES ($1, $2, $3)",
				[user.userId, finalScore, newRank]
			);
		}
	}

	const { rows: updatedLeaderboard } = await pool.query(
		"SELECT userid, score, rank FROM leaderboard ORDER BY score DESC, userid ASC"
	);
	return updatedLeaderboard.map(u => ({
		userId: u.userid,
		score: u.score,
		rank: u.rank,
	}));
}

export async function resetLeaderboard() {
	await pool.query("DELETE FROM leaderboard");
}

export async function getLeaderboard(): Promise<
	{
		userId: string;
		score: number;
		rank: string;
	}[]
> {
	const { rows } = await pool.query(
		"SELECT userid, score, rank FROM leaderboard ORDER BY score DESC, userid ASC"
	);
	return rows.map(u => ({
		userId: String(u.userid ?? ""),
		score: Number(u.score ?? 0),
		rank: String(u.rank ?? "bronze"),
	}));
}
