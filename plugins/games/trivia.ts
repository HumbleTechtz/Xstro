import { Command } from "../../src/Core/plugin.ts";
import { fetch } from "../../src/Utils/fetch.mts";

interface TriviaGame {
	chatId: string;
	players: Map<string, { score: number; answered: boolean }>;
	currentQuestion: number;
	totalQuestions: number;
	questionData: {
		question: string;
		correct_answer: string;
		incorrect_answers: string[];
		category: string;
		difficulty: string;
		answers: string[];
		correctIndex: number;
	} | null;
	timer: NodeJS.Timeout | null;
	joinTimer: NodeJS.Timeout | null;
	state: "joining" | "playing" | "finished";
}

const activeGames = new Map<string, TriviaGame>();

Command({
	name: "trivia",
	fromMe: false,
	isGroup: true,
	desc: "Start a trivia game",
	type: "fun",
	function: async msg => {
		if (activeGames.has(msg.jid)) {
			return await msg.send("🎯 A trivia game is already active in this chat!");
		}

		const game: TriviaGame = {
			chatId: msg.jid,
			players: new Map(),
			currentQuestion: 0,
			totalQuestions: 10,
			questionData: null,
			timer: null,
			joinTimer: null,
			state: "joining",
		};

		activeGames.set(msg.jid, game);
		game.players.set(msg.sender, { score: 0, answered: false });

		await msg.send(
			"🎯 *TRIVIA GAME STARTING!*\n\n" +
				"📝 Type 'join' to participate\n" +
				"⏰ 30 seconds to join\n" +
				"🎮 10 questions total\n" +
				"⚡ Time decreases each round\n" +
				"🏆 Points increase each round\n\n" +
				`👤 Players joined: 1\n\n` +
				"_Game will start automatically after 30 seconds..._",
		);

		game.joinTimer = setTimeout(async () => {
			if (game.players.size === 0) {
				activeGames.delete(msg.jid);
				return await msg.send("❌ No players joined. Game cancelled.");
			}
			await startTriviaRound(msg, game);
		}, 30000);
	},
});

async function startTriviaRound(msg: any, game: TriviaGame) {
	if (game.joinTimer) {
		clearTimeout(game.joinTimer);
		game.joinTimer = null;
	}

	game.state = "playing";
	game.currentQuestion++;

	if (game.currentQuestion > game.totalQuestions) {
		return await endTriviaGame(msg, game);
	}

	const response = await fetch(
		"https://opentdb.com/api.php?amount=1&type=multiple",
	);
	const data = JSON.parse(response) as {
		results: Array<{
			question: string;
			correct_answer: string;
			incorrect_answers: string[];
			category: string;
			difficulty: string;
		}>;
	};

	const trivia = data.results[0];
	const answers = [...trivia.incorrect_answers, trivia.correct_answer];
	answers.sort(() => Math.random() - 0.5);
	const correctIndex = answers.indexOf(trivia.correct_answer);

	game.questionData = {
		...trivia,
		answers,
		correctIndex,
	};

	game.players.forEach(player => {
		player.answered = false;
	});

	const timeLimit = Math.max(15, 45 - (game.currentQuestion - 1) * 3);
	const points = Math.min(250, 40 + (game.currentQuestion - 1) * 20);

	const answerList = answers
		.map((answer, index) => `${String.fromCharCode(65 + index)}. ${answer}`)
		.join("\n");

	await msg.send(
		`🧠 *Question ${game.currentQuestion}/${game.totalQuestions}*\n` +
			`📂 ${trivia.category} | 🏆 ${points} points\n` +
			`⏰ ${timeLimit} seconds\n\n` +
			`${trivia.question}\n\n${answerList}\n\n` +
			`_Reply with A, B, C, or D_`,
	);

	game.timer = setTimeout(async () => {
		const answered = Array.from(game.players.values()).filter(
			p => p.answered,
		).length;
		const unanswered = game.players.size - answered;

		await msg.send(
			`⏰ *Time's up!*\n` +
				`✅ Correct answer: ${String.fromCharCode(65 + game.questionData!.correctIndex)}. ${game.questionData!.correct_answer}\n` +
				`📊 ${answered} answered, ${unanswered} didn't answer\n\n` +
				`_Next question in 3 seconds..._`,
		);

		setTimeout(() => startTriviaRound(msg, game), 3000);
	}, timeLimit * 1000);
}

async function endTriviaGame(msg: any, game: TriviaGame) {
	if (game.timer) clearTimeout(game.timer);
	if (game.joinTimer) clearTimeout(game.joinTimer);

	game.state = "finished";

	const leaderboard = Array.from(game.players.entries())
		.sort(([, a], [, b]) => b.score - a.score)
		.slice(0, 5);

	let result = "🏆 *TRIVIA GAME FINISHED!*\n\n📊 *Final Leaderboard:*\n\n";

	leaderboard.forEach(([player, data], index) => {
		const medal =
			index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅";
		const playerName = player.split("@")[0];
		result += `${medal} ${playerName}: ${data.score} points\n`;
	});

	if (leaderboard.length === 0) {
		result += "_No scores recorded_";
	}

	activeGames.delete(msg.jid);
	return await msg.send(result);
}

Command({
	on: true,
	function: async message => {
		const game = activeGames.get(message.jid);
		if (!game) return;

		const text = message.text?.toLowerCase().trim();
		if (!text) return;

		if (game.state === "joining" && text === "join") {
			if (game.players.has(message.sender)) {
				return await message.send("⚠️ You're already in the game!");
			}

			game.players.set(message.sender, { score: 0, answered: false });
			return await message.send(
				`✅ Joined the game!\n👥 Total players: ${game.players.size}`,
			);
		}

		if (
			game.state === "playing" &&
			game.questionData &&
			["a", "b", "c", "d"].includes(text)
		) {
			if (!game.players.has(message.sender)) {
				return;
			}

			const player = game.players.get(message.sender)!;
			if (player.answered) {
				return;
			}

			player.answered = true;
			const answerIndex = text.charCodeAt(0) - 97;

			if (answerIndex === game.questionData.correctIndex) {
				const points = Math.min(250, 40 + (game.currentQuestion - 1) * 20);
				player.score += points;
				await message.send(`✅ Correct! +${points} points`);
			} else {
				const correctLetter = String.fromCharCode(
					65 + game.questionData.correctIndex,
				);
				await message.send(`❌ Wrong! Correct: ${correctLetter}`);
			}

			const allAnswered = Array.from(game.players.values()).every(p => p.answered);
			if (allAnswered && game.timer) {
				clearTimeout(game.timer);

				const correctAnswer = game.questionData.correct_answer;
				const correctLetter = String.fromCharCode(
					65 + game.questionData.correctIndex,
				);

				await message.send(
					`🎯 *Everyone answered!*\n` +
						`✅ Correct: ${correctLetter}. ${correctAnswer}\n\n` +
						`_Next question in 3 seconds..._`,
				);

				setTimeout(() => startTriviaRound(message, game), 3000);
			}
		}
	},
});
