import { Command } from '../../messaging/plugin.ts';
import Message from '../../messaging/Messages/Message.ts';
import { updateLeaderboard } from '../../models/leaderboard.ts';
import { isLidUser } from 'baileys';

const games = new Map<string, Cwg>();
const pending = new Map<string, { jids: string[]; timers: NodeJS.Timeout[] }>();

Command({
	name: 'cwg',
	fromMe: false,
	isGroup: false,
	desc: 'Play Complete the Word Gap Game',
	type: 'games',
	function: async (message, match) => {
		const jid = message.jid;

		if (match === 'end' && games.has(jid)) {
			const ev = await games.get(jid)!.endGame(jid);
			return message.send(ev, { mentions: games.get(jid)!.getAllPlayers() });
		}

		if (games.has(jid))
			return message.send(
				'```A Complete the Word Gap Game is already in progress.```',
				{ mentions: [] },
			);
		if (pending.has(jid))
			return message.send(
				'```A Complete the Word Gap Game is already gathering challengers.```',
				{ mentions: [] },
			);

		pending.set(jid, { jids: [], timers: [] });

		await message.send(
			'```Complete the Word Gap Game starting! Type "join" to participate.```',
			{ mentions: [] },
		);

		let countdown = 30;

		const countdownInterval = setInterval(() => {
			if (countdown > 0) {
				message.send(`\`\`\`Game starting in ${countdown} seconds.\`\`\``, {
					mentions: pending.get(jid)!.jids,
				});
				countdown -= 10;
			} else {
				clearInterval(countdownInterval);
			}
		}, 10000);

		const startTimer = setTimeout(async () => {
			const p = pending.get(jid)!;
			pending.delete(jid);
			p.timers.forEach(t => clearTimeout(t));

			if (!p.jids.includes(message.sender)) p.jids.push(message.sender);

			const game = new Cwg(message);
			const result = await game.startGame(p.jids, jid);
			if (result) return message.send(result, { mentions: p.jids });

			games.set(jid, game);
			const playersText = p.jids.map(id => `@${id.split('@')[0]}`).join(', ');
			await message.send(
				`\`\`\`Complete the Word Gap Game started! Challengers: ${playersText}\`\`\``,
				{ mentions: p.jids },
			);
		}, 30000);

		pending.get(jid)!.timers.push(startTimer);
	},
});

Command({
	on: true,
	function: async (message: Message) => {
		const jid = message.jid;
		const text = message.text?.trim().toLowerCase();
		if (!text) return;

		if (
			text.includes('game started!') ||
			text.includes('complete the word gap game') ||
			!message.sender ||
			/\s/.test(text)
		)
			return;

		if (text === 'join' && pending.has(jid)) {
			const p = pending.get(jid)!;
			if (!p.jids.includes(message.sender)) {
				p.jids.push(message.sender);
				return message.send(
					`\`\`\`@${message.sender.split('@')[0]} joined the Match.\`\`\``,
					{ mentions: p.jids },
				);
			}
			return;
		}

		if (games.has(jid)) {
			const game = games.get(jid)!;
			const res = await game.playWord(text, message.sender);
			if (res) return message.send(res, { mentions: game.getAllPlayers() });
		}
	},
});

class Cwg {
	private message: Message;
	private originalPlayers: string[] = [];
	private players: string[] = [];
	private currentIndex: number = 0;
	private scores: Map<string, number> = new Map();
	private usedWords: Set<string> = new Set();
	private currentWord: string = '';
	private currentDefinition: string = '';
	private missingLetters: number = 1;
	private active: boolean = false;
	private timer: NodeJS.Timeout | null = null;
	private history: Array<{
		players: string[];
		winner: string | null;
		scores: Array<{ player: string; score: number }>;
	}> = [];
	private turnNumber: number = 0;
	private startCountdown: NodeJS.Timeout | null = null;
	private inactivityTimeout: NodeJS.Timeout | null = null;
	private currentTimeout: number = 0;

	constructor(message: Message) {
		this.message = message;
	}

	public async startGame(jids: string[], jid: string): Promise<string> {
		if (this.startCountdown) clearTimeout(this.startCountdown);
		this.originalPlayers = [...jids];
		this.players = [...jids];
		if (jids.length < 2) {
			this.cleanup(jid);
			return `\`\`\`Insufficient challengers to begin the Complete the Word Gap Game! At least 2 players are required.\`\`\``;
		}
		this.startCountdown = setTimeout(() => this.beginGame(jid), 1000);
		return '';
	}

	private async beginGame(jid: string): Promise<void> {
		if (this.players.length < 2) {
			this.cleanup(jid);
			await this.message.send(
				'```Insufficient challengers to begin the Complete the Word Gap Game! At least 2 players are required.```',
				{ mentions: this.originalPlayers },
			);
			return;
		}
		this.currentIndex = 0;
		this.scores = new Map(this.players.map(j => [j, 0]));
		this.usedWords.clear();
		this.missingLetters = 1;
		this.active = true;
		this.turnNumber = 0;
		this.currentTimeout = this.getCurrentTimeout();
		try {
			await this.setNewWord();
		} catch (error) {
			console.error(`Error in beginGame: ${error}`);
			this.cleanup(jid);
			await this.message.send(
				'```Failed to fetch a valid word. Game terminated.```',
				{ mentions: this.originalPlayers },
			);
			return;
		}
		this.scheduleNextTurn(jid);
		const prompt: string = this.getTurnPrompt();
		await this.message.send(prompt, { mentions: this.originalPlayers });
	}

	public async playWord(input: string, from: string): Promise<string> {
		console.log(`playWord called with input: ${input}, from: ${from}`);
		if (!this.active) {
			console.log('Game not active');
			return '';
		}
		const jid: string = this.players[this.currentIndex];
		if (from !== jid) {
			console.log(`Not player's turn: ${from} vs ${jid}`);
			return '';
		}
		const name: string = jid.split('@')[0];
		const word: string = input.toLowerCase().trim();

		if (!word || !/^[a-z]+$/.test(word)) {
			console.log(`Invalid input: ${word}`);
			return this.eliminate(
				jid,
				`\`\`\`@${name}, you've been eliminated.\nYour input "${word}" is invalid. Only single words with letters are allowed.\`\`\``,
				[...this.players],
			);
		}

		if (word !== this.currentWord) {
			console.log(`Incorrect word: ${word} vs ${this.currentWord}`);
			return this.eliminate(
				jid,
				`\`\`\`@${name}, you've been eliminated.\nYour word "${word}" does not match the correct word.\`\`\``,
				[...this.players],
			);
		}

		if (this.usedWords.has(word)) {
			console.log(`Word already used: ${word}`);
			return this.eliminate(
				jid,
				`\`\`\`@${name}, you've been eliminated.\nThe word "${word}" has already been used in this challenge.\`\`\``,
				[...this.players],
			);
		}

		this.clearTimer();
		this.resetInactivityTimer();
		this.usedWords.add(word);
		const pts: number = this.calculatePoints();
		this.scores.set(jid, (this.scores.get(jid) || 0) + pts);
		this.currentIndex = (this.currentIndex + 1) % this.players.length;
		this.turnNumber++;
		try {
			await this.setNewWord();
			console.log(`New word set: ${this.currentWord}`);
		} catch (error) {
			console.error(`Error in playWord setNewWord: ${error}`);
			const endMsg = await this.endGame(this.message.jid);
			await this.message.send(
				`\`\`\`@${name} scores ${pts} points for "${word}"!\nGame terminated due to word fetch error.\n\n${endMsg}\`\`\``,
				{ mentions: this.originalPlayers },
			);
			return '';
		}
		this.scheduleNextTurn(this.message.jid);

		const nextPlayer: string = this.players[this.currentIndex].split('@')[0];
		console.log(`Next turn for: ${nextPlayer}`);
		return `\`\`\`@${name} scores ${pts} points for "${word}" in the Game!\n\n@${nextPlayer}, your challenge awaits:\n${this.getTurnPrompt()}\`\`\``;
	}

	private async setNewWord(): Promise<void> {
		this.missingLetters = Math.min(Math.floor(this.turnNumber / 5) + 1, 5);
		let word = '';
		let definition = '';
		let attempts = 0;
		const maxAttempts = 5;
		while (
			!word ||
			this.usedWords.has(word) ||
			!definition ||
			definition === 'No definition available'
		) {
			if (attempts >= maxAttempts) {
				throw new Error('Failed to fetch a valid word with definition');
			}
			try {
				const resp = await fetch(
					`https://api.datamuse.com/words?ml=common&max=1`,
					{ signal: AbortSignal.timeout(5000) },
				);
				const arr = await resp.json();
				if (arr.length > 0 && arr[0].word.length >= this.missingLetters + 2) {
					word = arr[0].word;
					const defResp = await fetch(
						`https://api.datamuse.com/words?sp=${word}&md=d&max=1`,
						{ signal: AbortSignal.timeout(5000) },
					);
					const defArr = await defResp.json();
					definition = defArr[0]?.defs?.[0] || 'No definition available';
				}
			} catch (error) {
				console.error(`setNewWord error: ${error}`);
				attempts++;
				continue;
			}
			attempts++;
		}
		this.currentWord = word;
		this.currentDefinition = definition;
		console.log(`setNewWord: ${word}, definition: ${definition}`);
	}

	private calculatePoints(): number {
		const basePoints =
			this.missingLetters <= 2
				? 5 + this.missingLetters * 3
				: 20 + this.missingLetters * 10;
		return Math.max(
			5,
			Math.min(
				80,
				Math.floor(basePoints * Math.max(1, this.currentWord.length / 5)),
			),
		);
	}

	private getIncompleteWord(): string {
		const word = this.currentWord;
		const missingCount = this.missingLetters;
		const indices = new Set<number>();
		while (indices.size < missingCount) {
			const index = Math.floor(Math.random() * word.length);
			indices.add(index);
		}
		let result = '';
		for (let i = 0; i < word.length; i++) {
			result += indices.has(i) ? '_' : word[i];
		}
		return result.split('').join(' ');
	}

	private async eliminate(
		jid: string,
		msg: string,
		players: string[],
	): Promise<string> {
		console.log(`Eliminating player: ${jid}`);
		this.clearTimer();
		this.players = this.players.filter(p => p !== jid);
		if (this.currentIndex >= this.players.length) this.currentIndex = 0;
		if (this.players.length <= 1) {
			const endMsg: string = await this.endGame(this.message.jid);
			await this.message.send(`${msg}\n\n${endMsg}`, {
				mentions: this.originalPlayers,
			});
			return '';
		}
		try {
			await this.setNewWord();
		} catch (error) {
			console.error(`Error in eliminate setNewWord: ${error}`);
			const endMsg = await this.endGame(this.message.jid);
			await this.message.send(
				`${msg}\n\nGame terminated due to word fetch error.\n\n${endMsg}`,
				{ mentions: this.originalPlayers },
			);
			return '';
		}
		this.scheduleNextTurn(this.message.jid);

		const nextPlayer: string = this.players[this.currentIndex];
		const nextPlayerName: string = nextPlayer.split('@')[0];
		return `${msg}\n\n\`\`\`@${nextPlayerName}, your challenge awaits:\n${this.getTurnPrompt()}\`\`\``;
	}

	private getCurrentTimeout(): number {
		if (this.missingLetters === 1) return 35000;
		else if (this.missingLetters === 2) return 30000;
		else if (this.missingLetters === 3) return 25000;
		else if (this.missingLetters === 4) return 22000;
		else return 18000;
	}

	private scheduleNextTurn(jid: string): void {
		this.currentTimeout = this.getCurrentTimeout();
		console.log(`Scheduling next turn with timeout: ${this.currentTimeout}`);
		if (!this.active || !this.players.length) {
			console.log('Game not active or no players, cleaning up');
			this.cleanup(jid);
			return;
		}
		this.clearTimer();
		this.timer = setTimeout(async () => {
			if (this.active && this.players.length) {
				const playerJid: string = this.players[this.currentIndex];
				const name: string = playerJid.split('@')[0];
				const message: string = `\`\`\`@${name}, you've been eliminated from the Complete the Word Gap Game!\nYou ran out of time to submit a word.\`\`\``;
				console.log(`Timeout elimination for: ${name}`);
				const out: string = await this.eliminate(playerJid, message, [
					...this.players,
				]);
				if (out) {
					await this.message.send(out, { mentions: this.originalPlayers });
				}
			} else {
				console.log('Game ended during timeout, cleaning up');
				this.cleanup(jid);
			}
		}, this.currentTimeout);
	}

	private clearTimer(): void {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
			console.log('Timer cleared');
		}
	}

	private resetInactivityTimer(): void {
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
			console.log('Inactivity timer cleared');
		}
		this.inactivityTimeout = setTimeout(async () => {
			if (this.active) {
				console.log('Inactivity timeout triggered');
				const endMsg: string = await this.forceEndGame(this.message.jid);
				await this.message.send(endMsg, { mentions: this.originalPlayers });
			}
		}, 60000);
	}

	public async endGame(jid: string): Promise<string> {
		console.log('Ending game');
		const scoreArray: [string, number][] = this.originalPlayers.map(p => [
			p,
			this.scores.get(p) || 0,
		]);
		scoreArray.sort((a, b) => b[1] - a[1]);

		const scoreText: string = scoreArray
			.map(([p, s]) => `@${p.split('@')[0]}: ${s} points`)
			.join('\n');

		const result: string = scoreArray[0]
			? `\`\`\`@${scoreArray[0][0].split('@')[0]} claims victory in this Match with ${scoreArray[0][1]} points!\n\nRankings:\n${scoreText}\`\`\``
			: `\`\`\`The Complete the Word Gap Game has concluded!\n\nRankings:\n${scoreText}\`\`\``;
		const validPlayers = this.originalPlayers.filter(userId =>
			isLidUser(userId),
		);
		await updateLeaderboard(
			validPlayers.map(userId => ({
				userId,
				score: this.scores.get(userId) || 0,
			})),
		);

		this.cleanup(jid);
		return result;
	}

	private async forceEndGame(jid: string): Promise<string> {
		console.log('Forcing game end due to inactivity');
		const scoreArray: [string, number][] = this.originalPlayers.map(p => [
			p,
			this.scores.get(p) || 0,
		]);
		scoreArray.sort((a, b) => b[1] - a[1]);

		const scoreText: string = scoreArray
			.map(([p, s]) => `@${p.split('@')[0]}: ${s} points`)
			.join('\n');

		const result: string = scoreArray[0]
			? `\`\`\`@${scoreArray[0][0].split('@')[0]} claims victory in the Complete the Word Gap Game with ${scoreArray[0][1]} points due to inactivity!\n\nRankings:\n${scoreText}\`\`\``
			: `\`\`\`The Complete the Word Gap Game has concluded due to inactivity!\n\nRankings:\n${scoreText}\`\`\``;
		const validPlayers = this.originalPlayers.filter(userId =>
			isLidUser(userId),
		);
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
		console.log('Cleaning up game state');
		this.active = false;
		if (this.startCountdown) {
			clearTimeout(this.startCountdown);
			this.startCountdown = null;
		}
		this.clearTimer();
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
			this.inactivityTimeout = null;
		}
		this.players = [];
		this.scores.clear();
		this.usedWords.clear();
		this.currentWord = '';
		this.currentDefinition = '';
		this.currentIndex = 0;
		this.turnNumber = 0;
		this.history = [];
		this.currentTimeout = 0;
		this.missingLetters = 1;
		games.delete(jid);
	}

	getTurnPrompt(): string {
		if (!this.active || !this.players.length) {
			console.log('No turn prompt: game inactive or no players');
			return '';
		}
		const jid: string = this.players[this.currentIndex];
		const name: string = jid.split('@')[0];
		const incompleteWord = this.getIncompleteWord();
		return `\`\`\`@${name}, your challenge awaits in this Match:\nComplete the word: ${incompleteWord}\nDefinition: ${this.currentDefinition}\nYou have ${this.currentTimeout / 1000} seconds to respond!\`\`\``;
	}

	getCurrentPlayer(): string {
		return this.players[this.currentIndex] || '';
	}

	getNextPlayer(): string {
		return this.players[(this.currentIndex + 1) % this.players.length] || '';
	}

	getAllPlayers(): string[] {
		return [...this.originalPlayers];
	}
}
