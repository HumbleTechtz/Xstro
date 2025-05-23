interface Player {
	name: string;
	score: number;
	isActive: boolean;
}

export default class Wcg {
	private currentWord = '';
	private usedWords = new Set<string>();
	private isGameOver = false;
	private mode = 'easy';
	private minLength = 3;
	private players: Player[] = [];
	private currentPlayerIndex = 0;
	private timeLimits: { [key: string]: number } = {
		easy: 55,
		medium: 45,
		hard: 35,
	};
	private timeoutId: NodeJS.Timeout | null = null;

	async startGame(mode = 'easy', playerNames: string[]): Promise<string> {
		this.currentWord = '';
		this.usedWords.clear();
		this.isGameOver = false;
		this.mode = mode.toLowerCase();
		this.minLength = mode === 'easy' ? 3 : mode === 'medium' ? 5 : 7;
		this.players = playerNames.map(name => ({
			name,
			score: 0,
			isActive: true,
		}));
		this.currentPlayerIndex = 0;
		const playerList = this.players
			.map(p => `@${p.name.split('@')[0]}`)
			.join('\n');
		return `\`\`\`Game Started\n\nPlayers:\n${playerList}\n\n${this.getTurnPrompt()}\`\`\``;
	}

	async playWord(word: string): Promise<string> {
		if (this.isGameOver || this.players.filter(p => p.isActive).length < 1) {
			this.isGameOver = true;
			return '```Game over! No players left.```';
		}

		this.clearTurnTimer();
		word = word.toLowerCase().trim();
		const player = this.players[this.currentPlayerIndex];

		if (!(await this.isValidWord(word))) {
			this.removePlayer();
			return `\`\`\`Sorry, "${word}" is not a valid word.\n\n@${player.name.split('@')[0]} is kicked out from the Game!\n\n${this.getTurnPrompt()}\`\`\``;
		}

		if (this.usedWords.has(word)) {
			this.removePlayer();
			return `\`\`\`Oops, "${word}" has already been used.\n\n@${player.name.split('@')[0]} is kicked out from the Game!\n\n${this.getTurnPrompt()}\`\`\``;
		}

		if (this.currentWord && this.currentWord.slice(-1) !== word[0]) {
			this.removePlayer();
			return `\`\`\`Uh-oh, "${word}" doesn't start with the letter "${this.currentWord.slice(-1)}".\n\n@${player.name.split('@')[0]} is kicked out from the Game!\n\n${this.getTurnPrompt()}\`\`\``;
		}

		this.usedWords.add(word);
		this.currentWord = word;
		player.score += word.length;
		this.advanceTurn();

		const activePlayers = this.players.filter(p => p.isActive);
		if (activePlayers.length === 1) {
			return `\`\`\`Correct!\n\nCongratulations, @${activePlayers[0].name.split('@')[0]} is the winner with a score of ${activePlayers[0].score}!\`\`\``;
		}

		return `\`\`\`Correct!\n\n${this.getTurnPrompt()}\`\`\``;
	}

	startTurnTimer(): Promise<string> {
		return new Promise(resolve => {
			this.timeoutId = setTimeout(() => {
				const player = this.players[this.currentPlayerIndex];
				this.removePlayer();
				const message = `\`\`\`@${player.name.split('@')[0]}, your time is up! You are kicked out of the game.\n\n${this.getTurnPrompt()}\`\`\``;
				resolve(message);
			}, this.timeLimits[this.mode] * 1000);
		});
	}

	private clearTurnTimer(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	private async isValidWord(word: string): Promise<boolean> {
		if (word.length < this.minLength) return false;
		try {
			const response = await fetch(
				`https://api.datamuse.com/words?sp=${word}&max=1`,
			);
			const data = await response.json();
			return data.length > 0 && data[0].word === word;
		} catch {
			return false;
		}
	}

	private advanceTurn(): void {
		this.currentPlayerIndex =
			(this.currentPlayerIndex + 1) % this.players.length;
		while (
			!this.players[this.currentPlayerIndex].isActive &&
			this.players.filter(p => p.isActive).length > 0
		) {
			this.currentPlayerIndex =
				(this.currentPlayerIndex + 1) % this.players.length;
		}
	}

	private removePlayer(): void {
		this.players[this.currentPlayerIndex].isActive = false;
		if (this.players.filter(p => p.isActive).length === 0)
			this.isGameOver = true;
		else this.advanceTurn();
	}

	private getTurnPrompt(): string {
		const activePlayers = this.players.filter(p => p.isActive);
		if (activePlayers.length === 0) return 'Game over! No players left.';
		if (activePlayers.length === 1) {
			return `Congratulations, @${activePlayers[0].name.split('@')[0]} is the winner with a score of ${activePlayers[0].score}!`;
		}
		const nextPlayer = this.players[this.currentPlayerIndex].name;
		const nextLetter = this.currentWord
			? this.currentWord.slice(-1).toUpperCase()
			: 'A';
		const timeLimit = this.timeLimits[this.mode];
		const minLength = this.minLength;
		return `@${nextPlayer.split('@')[0]}'s Turn! You have ${timeLimit} secs to provide a ${minLength}+ letter word that starts with the letter "${nextLetter}"`;
	}

	status(): string {
		const activePlayers = this.players.filter(p => p.isActive);
		if (activePlayers.length === 0) return 'Game over! No players left.';
		if (activePlayers.length === 1)
			return `\`\`\`Congratulations, @${activePlayers[0].name.split('@')[0]} is the winner with a score of ${activePlayers[0].score}!`;
		return `${activePlayers.length} active players. Current turn: ${this.getTurnPrompt()}\`\`\``;
	}
}
