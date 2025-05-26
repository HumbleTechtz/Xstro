import { Command } from '../../messaging/plugin.ts';
import Message from '../../messaging/Messages/Message.ts';

const games = new Map<string, Wcg>();
const pending = new Map<string, { jids: string[]; timers: NodeJS.Timeout[] }>();

Command({
	name: 'wcg',
	fromMe: false,
	isGroup: false,
	desc: 'Play Word Chain Game',
	type: 'games',
	function: async (message, match) => {
		const jid = message.jid;

		if (match === 'end' && games.has(jid)) {
			const ev = games.get(jid)!.endGame(jid);
			return message.send(ev);
		}

		if (games.has(jid))
			return message.send('```A Word Chain Game is already in progress.```');
		if (pending.has(jid))
			return message.send(
				'```A Word Chain Game is already gathering challengers.```',
			);

		pending.set(jid, { jids: [], timers: [] });

		await message.send(
			'```Word Chain Game starting! Type "join" to participate.```',
		);

		let countdown = 30;

		const countdownInterval = setInterval(() => {
			if (countdown > 0) {
				message.send(`\`\`\`Game starting in ${countdown} seconds.\`\`\``);
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

			const game = new Wcg(message);
			const result = await game.startGame(p.jids, jid);
			if (result) return message.send(result);

			games.set(jid, game);
			const playersText = p.jids.map(id => `@${id.split('@')[0]}`).join(', ');
			await message.send(
				`\`\`\`Word Chain Game started! Challengers: ${playersText}\`\`\``,
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
			text.includes('word chain game') ||
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
					{ mentions: [message.sender] },
				);
			}
			return;
		}

		if (games.has(jid)) {
			const game = games.get(jid)!;
			const res = await game.playWord(text, message.sender);
			if (res)
				return message.send(res, {
					mentions: [game.getCurrentPlayer(), game.getNextPlayer()],
				});
		}
	},
});

class Wcg {
	private message: Message;
	private originalPlayers: string[] = [];
	private players: string[] = [];
	private currentIndex: number = 0;
	private scores: Map<string, number> = new Map();
	private usedWords: Set<string> = new Set();
	private lastLetter: string = '';
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
	private minLen: number = 3;
	private readonly alphabet: string = 'abcdefghijklmnopqrstuvwxyz';

	constructor(message: Message) {
		this.message = message;
	}

	public async startGame(jids: string[], jid: string): Promise<string> {
		if (this.startCountdown) clearTimeout(this.startCountdown);
		this.originalPlayers = [...jids];
		this.players = [...jids];
		if (jids.length < 2) {
			this.cleanup(jid);
			return `\`\`\`Insufficient challengers to begin the Word Chain Game! At least 2 players are required.\`\`\``;
		}
		this.startCountdown = setTimeout(() => this.beginGame(jid), 1000);
		return '';
	}

	private async beginGame(jid: string): Promise<void> {
		if (this.players.length < 2) {
			this.cleanup(jid);
			await this.message.send(
				'```Insufficient challengers to begin the Word Chain Game! At least 2 players are required.```',
			);
			return;
		}
		this.currentIndex = 0;
		this.scores = new Map(this.players.map(j => [j, 0]));
		this.usedWords.clear();
		this.lastLetter = this.alphabet[Math.floor(Math.random() * 26)];
		this.minLen = 3;
		this.active = true;
		this.turnNumber = 0;
		this.scheduleNextTurn(jid);
		const prompt: string = this.getTurnPrompt();
		await this.message.send(prompt, {
			mentions: [this.players[this.currentIndex]],
		});
	}

	public async playWord(input: string, from: string): Promise<string> {
		if (!this.active) return '';
		const jid: string = this.players[this.currentIndex];
		if (from !== jid) return '';
		const name: string = jid.split('@')[0];
		const word: string = input.toLowerCase().trim();

		this.minLen = Math.floor(this.turnNumber / 5) + 3;
		if (word.length < this.minLen) {
			return this.eliminate(
				jid,
				`\`\`\`@${name}, you've been eliminated.\nYour word "${word}" is too short. Words must be at least ${this.minLen} letters long.\`\`\``,
				[...this.players],
			);
		}

		if (this.lastLetter && word[0] !== this.lastLetter) {
			return this.eliminate(
				jid,
				`\`\`\`@${name}, you've been eliminated.\nYour word "${word}" must start with "${this.lastLetter.toUpperCase()}".\`\`\``,
				[...this.players],
			);
		}
		if (this.usedWords.has(word)) {
			return this.eliminate(
				jid,
				`\`\`\`@${name}, you've been eliminated.\nThe word "${word}" has already been used in this challenge.\`\`\``,
				[...this.players],
			);
		}

		const valid: boolean = await this.checkWord(word);
		if (!valid) {
			return this.eliminate(
				jid,
				`\`\`\`@${name}, you've been eliminated.\n"${word}" is an invalid word.\`\`\``,
				[...this.players],
			);
		}

		this.clearTimer();
		this.resetInactivityTimer();
		this.usedWords.add(word);
		const pts: number = word.length;
		this.scores.set(jid, (this.scores.get(jid) || 0) + pts);
		this.lastLetter = word[word.length - 1];
		this.currentIndex = (this.currentIndex + 1) % this.players.length;
		this.turnNumber++;
		this.scheduleNextTurn(this.message.jid);

		const nextPlayer: string = this.players[this.currentIndex].split('@')[0];
		return `\`\`\`@${name} scores ${pts} points for "${word}" in the Game!\n\n@${nextPlayer}, your challenge awaits:\nSubmit a word starting with "${this.lastLetter.toUpperCase()}" (${this.minLen}+ letters).\nYou have ${this.currentTimeout / 1000} seconds to respond!\`\`\``;
	}

	private async checkWord(w: string): Promise<boolean> {
		try {
			const resp = await fetch(`https://api.datamuse.com/words?sp=${w}&max=1`);
			const arr = await resp.json();
			const isValid: boolean = arr.length > 0 && arr[0].word === w;
			return isValid;
		} catch {
			return false;
		}
	}

	private async eliminate(
		jid: string,
		msg: string,
		players: string[],
	): Promise<string> {
		this.clearTimer();
		this.players = this.players.filter(p => p !== jid);
		if (this.currentIndex >= this.players.length) this.currentIndex = 0;
		if (this.players.length <= 1) {
			const endMsg: string = this.endGame(this.message.jid);
			await this.message.send(`${msg}\n\n${endMsg}`, {
				mentions: [jid, ...this.originalPlayers],
			});
			return '';
		}
		this.scheduleNextTurn(this.message.jid);

		const nextPlayer: string = this.players[this.currentIndex];
		const nextPlayerName: string = nextPlayer.split('@')[0];
		return `${msg}\n\n\`\`\`@${nextPlayerName}, your challenge awaits:\nSubmit a word starting with "${this.lastLetter.toUpperCase()}" (${this.minLen}+ letters).\nYou have ${this.currentTimeout / 1000} seconds to respond!\`\`\``;
	}

	private getCurrentTimeout(): number {
		if (this.minLen === 3) this.currentTimeout = 35000;
		else if (this.minLen === 4) this.currentTimeout = 30000;
		else if (this.minLen === 5) this.currentTimeout = 25000;
		else if (this.minLen === 6) this.currentTimeout = 22000;
		else if (this.minLen === 7) this.currentTimeout = 18000;
		else this.currentTimeout = 14000;
		return this.currentTimeout;
	}

	private scheduleNextTurn(jid: string): void {
		const timeout: number = this.getCurrentTimeout();
		if (!this.active || !this.players.length) {
			this.cleanup(jid);
			return;
		}
		this.clearTimer();
		this.timer = setTimeout(async () => {
			if (this.active && this.players.length) {
				const playerJid: string = this.players[this.currentIndex];
				const name: string = playerJid.split('@')[0];
				const message: string = `\`\`\`@${name}, you've been eliminated from the Word Chain Game!\nYou ran out of time to submit a word.\`\`\``;
				const out: string = await this.eliminate(playerJid, message, [
					...this.players,
				]);
				if (out) {
					await this.message.send(out, {
						mentions: this.players.length
							? [this.players[this.currentIndex]]
							: [],
					});
				}
			} else {
				this.cleanup(jid);
			}
		}, timeout);
	}

	private clearTimer(): void {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	private resetInactivityTimer(): void {
		if (this.inactivityTimeout) {
			clearTimeout(this.inactivityTimeout);
		}
		this.inactivityTimeout = setTimeout(async () => {
			if (this.active) {
				const endMsg: string = this.forceEndGame(this.message.jid);
				await this.message.send(endMsg, {
					mentions: this.players.length ? this.originalPlayers : [],
				});
			}
		}, 60000);
	}

	public endGame(jid: string): string {
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
			: `\`\`\`The Word Chain Game has concluded!\n\nRankings:\n${scoreText}\`\`\``;

		this.cleanup(jid);
		return result;
	}

	private forceEndGame(jid: string): string {
		const scoreArray: [string, number][] = this.originalPlayers.map(p => [
			p,
			this.scores.get(p) || 0,
		]);
		scoreArray.sort((a, b) => b[1] - a[1]);

		const scoreText: string = scoreArray
			.map(([p, s]) => `@${p.split('@')[0]}: ${s} points`)
			.join('\n');

		const result: string = scoreArray[0]
			? `\`\`\`@${scoreArray[0][0].split('@')[0]} claims victory in the Word Chain Game with ${scoreArray[0][1]} points due to inactivity!\n\nRankings:\n${scoreText}\`\`\``
			: `\`\`\`The Word Chain Game has concluded due to inactivity!\n\nRankings:\n${scoreText}\`\`\``;

		this.cleanup(jid);
		return result;
	}

	private cleanup(jid: string): void {
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
		this.lastLetter = '';
		this.currentIndex = 0;
		this.turnNumber = 0;
		this.history = [];
		this.currentTimeout = 0;
		this.minLen = 3;
		games.delete(jid);
	}

	getTurnPrompt(): string {
		if (!this.active || !this.players.length) return '';
		const jid: string = this.players[this.currentIndex];
		const name: string = jid.split('@')[0];
		if (!this.lastLetter) {
			this.lastLetter = this.alphabet[Math.floor(Math.random() * 26)];
		}
		this.minLen = Math.floor(this.turnNumber / 5) + 3;
		return `\`\`\`@${name}, your challenge awaits in this Match:\nSubmit a word starting with "${this.lastLetter.toUpperCase()}" (${this.minLen}+ letters).\nYou have ${this.currentTimeout / 1000} seconds to respond!\`\`\``;
	}

	getCurrentPlayer(): string {
		return this.players[this.currentIndex] || '';
	}

	getNextPlayer(): string {
		return this.players[(this.currentIndex + 1) % this.players.length] || '';
	}
}
