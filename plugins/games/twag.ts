import { isLidUser } from "baileys";
import { Command } from "../../src/Core/plugin.ts";
import { updateLeaderboard } from "../../src/Models/index.ts";
import { TOPICS } from "./words.ts";
import type { Serialize } from "../../src/Core/serialize.ts";

const twagGames = new Map<string, Twag>();
const twagPending = new Map<
	string,
	{ jids: string[]; timers: NodeJS.Timeout[] }
>();

Command({
	name: "twag",
	fromMe: false,
	isGroup: false,
	desc: "Play Topic Word Association Game",
	type: "games",
	function: async (message, match) => {
		const jid = message.jid;

		if (match === "end" && twagGames.has(jid)) {
			const ev = await twagGames.get(jid)!.endGame(jid);
			return message.send(ev);
		}

		if (twagGames.has(jid))
			return message.send("```A game is already in progress.```");
		if (twagPending.has(jid))
			return message.send("```Game is gathering challengers.```");

		twagPending.set(jid, { jids: [], timers: [] });
		await message.send(
			'```Topic Word Game starting! Type "join" to participate.```',
		);

		let countdown = 30;
		const countdownInterval = setInterval(() => {
			if (countdown > 0) {
				message.send(`\`\`\`Starting in ${countdown} seconds.\`\`\``);
				countdown -= 10;
			} else {
				clearInterval(countdownInterval);
			}
		}, 10000);

		const startTimer = setTimeout(async () => {
			const p = twagPending.get(jid)!;
			twagPending.delete(jid);
			p.timers.forEach(t => clearTimeout(t));
			if (!p.jids.includes(message.sender)) p.jids.push(message.sender);

			const game = new Twag(message);
			const result = await game.startGame(p.jids, jid);
			if (result) return message.send(result);

			twagGames.set(jid, game);
			const playersText = p.jids.map(id => `@${id.split("@")[0]}`).join(", ");
			await message.send(`\`\`\`Game started! Players: ${playersText}\`\`\``, {
				mentions: p.jids,
			});
		}, 30000);

		twagPending.get(jid)!.timers.push(startTimer);
	},
});

Command({
	on: true,
	function: async message => {
		const jid = message.jid;
		const text = message.text?.trim().toLowerCase();
		if (!text) return;

		if (
			text.includes("game started!") ||
			text.includes("topic word") ||
			!message.sender
		)
			return;

		if (text === "join" && twagPending.has(jid)) {
			const p = twagPending.get(jid)!;
			if (!p.jids.includes(message.sender)) {
				p.jids.push(message.sender);
				return message.send(
					`\`\`\`@${message.sender.split("@")[0]} joined.\`\`\``,
					{ mentions: [message.sender] },
				);
			}
			return;
		}

		if (twagGames.has(jid)) {
			const game = twagGames.get(jid)!;
			const res = await game.playWord(text, message.sender);
			if (res)
				return message.send(res, {
					mentions: [game.getCurrentPlayer(), game.getNextPlayer()],
				});
		}
	},
});

class Twag {
	private message: Serialize;
	private originalPlayers: string[] = [];
	private players: string[] = [];
	private currentIndex = 0;
	private scores = new Map<string, number>();
	private active = false;
	private timer: NodeJS.Timeout | null = null;
	private turnNumber = 0;
	private currentTimeout = 30000;
	private currentTopic = "";
	private usedWords: string[] = [];
	private wordsInCurrentTopic = 0;
	private topicKeys = Object.keys(TOPICS);

	constructor(message: Serialize) {
		this.message = message;
	}

	async startGame(jids: string[], jid: string): Promise<string> {
		this.originalPlayers = [...jids];
		this.players = [...jids];
		if (jids.length < 2) {
			this.cleanup(jid);
			return `\`\`\`Need at least 2 players.\`\`\``;
		}
		setTimeout(() => this.beginGame(jid), 1000);
		return "";
	}

	private async beginGame(jid: string): Promise<void> {
		if (this.players.length < 2) {
			this.cleanup(jid);
			await this.message.send("```Need at least 2 players.```");
			return;
		}
		this.currentIndex = 0;
		this.scores = new Map(this.players.map(j => [j, 0]));
		this.active = true;
		this.turnNumber = 0;
		this.setNewTopic();
		this.scheduleNextTurn(jid);
		const prompt = this.getTurnPrompt();
		await this.message.send(prompt, {
			mentions: [this.players[this.currentIndex]],
		});
	}

	private setNewTopic(): void {
		this.currentTopic =
			this.topicKeys[Math.floor(Math.random() * this.topicKeys.length)];
		this.usedWords = [];
		this.wordsInCurrentTopic = 0;
	}

	private isWordValid(word: string): boolean {
		return (
			TOPICS[this.currentTopic].includes(word) && !this.usedWords.includes(word)
		);
	}

	async playWord(input: string, from: string): Promise<string> {
		if (!this.active) return "";
		const jid = this.players[this.currentIndex];
		if (from !== jid) return "";
		const name = jid.split("@")[0];
		const word = input.toLowerCase().trim();

		const basePoints = 5 + Math.floor(word.length / 2);
		const timeBonus = Math.floor(this.currentTimeout / 5000);
		const points = Math.min(80, basePoints + timeBonus);

		if (this.isWordValid(word)) {
			this.clearTimer();
			this.scores.set(jid, (this.scores.get(jid) || 0) + points);
			this.usedWords.push(word);
			this.wordsInCurrentTopic++;
			this.currentIndex = (this.currentIndex + 1) % this.players.length;
			this.turnNumber++;

			if (this.wordsInCurrentTopic >= 10) {
				this.setNewTopic();
			}

			this.scheduleNextTurn(this.message.jid);
			const nextPlayer = this.players[this.currentIndex].split("@")[0];
			return `\`\`\`@${name} scores ${points} points for "${word}"!\n\n@${nextPlayer}: ${this.getTurnPrompt()}\`\`\``;
		} else {
			return this.eliminate(
				jid,
				`\`\`\`@${name}, eliminated. "${word}" is invalid.\`\`\``,
			);
		}
	}

	private async eliminate(jid: string, msg: string): Promise<string> {
		this.clearTimer();
		this.players = this.players.filter(p => p !== jid);
		if (this.currentIndex >= this.players.length) this.currentIndex = 0;
		if (this.players.length <= 1) {
			const endMsg = await this.endGame(this.message.jid);
			await this.message.send(`${msg}\n\n${endMsg}`, {
				mentions: [jid, ...this.originalPlayers],
			});
			return "";
		}

		this.scheduleNextTurn(this.message.jid);
		const nextPlayer = this.players[this.currentIndex].split("@")[0];
		return `${msg}\n\n\`\`\`@${nextPlayer}: ${this.getTurnPrompt()}\`\`\``;
	}

	private scheduleNextTurn(jid: string): void {
		if (!this.active || !this.players.length) {
			this.cleanup(jid);
			return;
		}
		this.clearTimer();
		this.timer = setTimeout(async () => {
			if (this.active && this.players.length) {
				const playerJid = this.players[this.currentIndex];
				const name = playerJid.split("@")[0];
				const message = `\`\`\`@${name}, eliminated (timeout).\`\`\``;
				const out = await this.eliminate(playerJid, message);
				if (out)
					await this.message.send(out, {
						mentions: [this.players[this.currentIndex]],
					});
			} else {
				this.cleanup(jid);
			}
		}, this.currentTimeout);
	}

	private clearTimer(): void {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	async endGame(jid: string): Promise<string> {
		const scoreArray = [...this.scores.entries()].sort((a, b) => b[1] - a[1]);
		const scoreText = scoreArray
			.map(([p, s]) => `@${p.split("@")[0]}: ${s}`)
			.join("\n");

		const result = scoreArray[0]
			? `\`\`\`@${scoreArray[0][0].split("@")[0]} wins with ${scoreArray[0][1]} points!\n\nRankings:\n${scoreText}\`\`\``
			: `\`\`\`Game ended!\n\nRankings:\n${scoreText}\`\`\``;

		const validPlayers = this.originalPlayers.filter(isLidUser);
		await updateLeaderboard(
			validPlayers.map(userId => ({
				userId,
				score: this.scores.get(userId) || 0,
			})),
		);

		this.cleanup(jid);
		return result;
	}

	private cleanup(jid: string): void {
		this.active = false;
		this.players = [];
		this.scores.clear();
		this.currentIndex = 0;
		this.turnNumber = 0;
		this.currentTopic = "";
		this.usedWords = [];
		this.wordsInCurrentTopic = 0;
		this.clearTimer();
		twagGames.delete(jid);
	}

	getTurnPrompt(): string {
		if (!this.active || !this.players.length) return "";
		const jid = this.players[this.currentIndex];
		const name = jid.split("@")[0];
		return `Topic: ${this.currentTopic.toUpperCase()}\nWords: ${this.wordsInCurrentTopic}/10\n@${name}, your turn!`;
	}

	getCurrentPlayer(): string {
		return this.players[this.currentIndex] || "";
	}

	getNextPlayer(): string {
		return this.players[(this.currentIndex + 1) % this.players.length] || "";
	}
}
