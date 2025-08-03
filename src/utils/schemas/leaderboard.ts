import { Pool } from "pg";
import { logger } from "../logger.ts";

const pool = new Pool({
  connectionString:
    "postgres://avnadmin:AVNS_DAiFNxk2X8X53ZcL89G@leaderboard-leaderboard-whatsappbot.e.aivencloud.com:17564/defaultdb",
  ssl: {
    rejectUnauthorized: false,
  },
  keepAlive: true,
});

async function PostgreDB() {
  await pool.query(`
	CREATE TABLE IF NOT EXISTS leaderboard (
		userid VARCHAR(255) PRIMARY KEY,
		score INTEGER NOT NULL,
		rank VARCHAR(50) NOT NULL DEFAULT 'bronze'
	)`);
}

PostgreDB().catch(logger.error);

const SCORE_THRESHOLDS = {
  legend: 7000,
  master: 5400,
  diamond: 3200,
  platinum: 800,
  gold: 600,
  silver: 500,
  bronze: 0,
};

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
  users: { userId: string; score: number }[],
) {
  const { rows: currentLeaderboard } = await pool.query(
    "SELECT userid, score, rank FROM leaderboard",
  );

  const dbMap = new Map(currentLeaderboard.map((u) => [u.userid, u]));

  // Get top 3 players by score
  const top3 = [...users]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((u) => u.userId);

  for (const user of users) {
    const entry = dbMap.get(user.userId);
    const currentScore = entry?.score || 0;
    const currentRank = entry?.rank || "bronze";

    let finalScore;

    // If player is in top 3: add 60 points
    if (top3.includes(user.userId)) {
      finalScore = currentScore + user.score + 60;
    } else {
      // If player is legend/master/diamond but not in top 3: deduct 80 points
      if (["legend", "master", "diamond"].includes(currentRank)) {
        finalScore = currentScore + user.score - 80;
      } else {
        // Regular scoring for other ranks
        finalScore = currentScore + user.score;
      }
    }

    finalScore = Math.max(finalScore, 0);
    const newRank = determineRank(finalScore);

    if (entry) {
      await pool.query(
        "UPDATE leaderboard SET score = $1, rank = $2 WHERE userid = $3",
        [finalScore, newRank, user.userId],
      );
    } else {
      await pool.query(
        "INSERT INTO leaderboard (userid, score, rank) VALUES ($1, $2, $3)",
        [user.userId, finalScore, newRank],
      );
    }
  }

  const { rows: updatedLeaderboard } = await pool.query(
    "SELECT userid, score, rank FROM leaderboard ORDER BY score DESC, userid ASC",
  );
  return updatedLeaderboard.map((u) => ({
    userId: u.userid,
    score: u.score,
    rank: u.rank,
  }));
}

async function resetLeaderboard() {
  await pool.query("DELETE FROM leaderboard");
}

async function getLeaderboard(): Promise<
  {
    userId: string;
    score: number;
    rank: string;
  }[]
> {
  const { rows } = await pool.query(
    "SELECT userid, score, rank FROM leaderboard ORDER BY score DESC, userid ASC",
  );
  return rows.map((u) => ({
    userId: String(u.userid ?? ""),
    score: Number(u.score ?? 0),
    rank: String(u.rank ?? "bronze"),
  }));
}
