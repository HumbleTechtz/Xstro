interface Player {
	name: string;
	score: number;
	isActive: boolean;
	wrongAttempts: number;
}

export default class Cwg {
	private currentWord = '';
	private obscuredWord = '';
	private currentDefinition = '';
	private usedWords = new Set<string>();
	private isGameOver = false;
	private players: Player[] = [];
	private currentPlayerIndex = 0;
	private roundCount = 0;
	private timeLimit = 40;
	private minLength = 3;
	private maxLength = 5;
	private missingLetters = 1;
	private timeoutId: NodeJS.Timeout | null = null;

	async startGame(playerNames: string[]): Promise<string> {
		this.currentWord = '';
		this.obscuredWord = '';
		this.currentDefinition = '';
		this.usedWords.clear();
		this.isGameOver = false;
		this.roundCount = 0;
		this.timeLimit = 40;
		this.minLength = 3;
		this.maxLength = 5;
		this.missingLetters = 1;
		this.players = playerNames.map(name => ({
			name,
			score: 0,
			isActive: true,
			wrongAttempts: 0,
		}));
		this.currentPlayerIndex = 0;
		await this.generateNewWord();
		const playerList = this.players
			.map(p => `@${p.name.split('@')[0]}`)
			.join('\n');
		return `\`\`\`Complete the Word Game Started\n\nPlayers:\n${playerList}\n\n${this.getTurnPrompt()}\`\`\``;
	}

	async playWord(word: string): Promise<string> {
		if (this.isGameOver || this.players.filter(p => p.isActive).length < 1) {
			this.isGameOver = true;
			return `\`\`\`Game over! No players left.\n\n${this.getRankings()}\`\`\``;
		}

		this.clearTurnTimer();
		word = word.toLowerCase().trim();
		const player = this.players[this.currentPlayerIndex];

		if (word !== this.currentWord) {
			player.wrongAttempts++;
			if (player.wrongAttempts >= 2) {
				this.removePlayer();
				return `\`\`\`Sorry, "${word}" is incorrect. @${player.name.split('@')[0]} has no attempts left and is kicked out!\n\n${this.getTurnPrompt()}\`\`\``;
			}
			this.advanceTurn();
			return `\`\`\`Sorry, "${word}" is incorrect. @${player.name.split('@')[0]} has ${2 - player.wrongAttempts} attempt(s) left.\n\n${this.getTurnPrompt()}\`\`\``;
		}

		player.score += 1;
		player.wrongAttempts = 0;
		this.usedWords.add(this.currentWord);
		this.roundCount++;
		await this.generateNewWord();
		this.advanceTurn();

		const activePlayers = this.players.filter(p => p.isActive);
		if (activePlayers.length === 1) {
			return `\`\`\`Correct! @${player.name.split('@')[0]} scores 1 point (total: ${player.score}).\n\nCongratulations, @${activePlayers[0].name.split('@')[0]} is the winner with a score of ${activePlayers[0].score}!\n\n${this.getRankings()}\`\`\``;
		}

		return `\`\`\`Correct! @${player.name.split('@')[0]} scores 1 point (total: ${player.score}).\n\n${this.getTurnPrompt()}\`\`\``;
	}

	startTurnTimer(): Promise<string> {
		return new Promise(resolve => {
			this.timeoutId = setTimeout(() => {
				const player = this.players[this.currentPlayerIndex];
				player.wrongAttempts++;
				if (player.wrongAttempts >= 2) {
					this.removePlayer();
					const message = `\`\`\`@${player.name.split('@')[0]}, your time is up! You have no attempts left and are kicked out.\n\n${this.getTurnPrompt()}\`\`\``;
					resolve(message);
				} else {
					this.advanceTurn();
					const message = `\`\`\`@${player.name.split('@')[0]}, your time is up! You have ${2 - player.wrongAttempts} attempt(s) left.\n\n${this.getTurnPrompt()}\`\`\``;
					resolve(message);
				}
			}, this.timeLimit * 1000);
		});
	}

	private clearTurnTimer(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	private async generateNewWord(): Promise<void> {
		if (this.roundCount < 6) {
			this.minLength = 3;
			this.maxLength = 5;
			this.missingLetters = 1;
			this.timeLimit = 40;
		} else if (this.roundCount < 11) {
			this.minLength = 4;
			this.maxLength = 6;
			this.missingLetters = Math.floor(Math.random() * 2) + 1;
			this.timeLimit = 35;
		} else if (this.roundCount < 16) {
			this.minLength = 5;
			this.maxLength = 7;
			this.missingLetters = Math.floor(Math.random() * 2) + 1;
			this.timeLimit = 30;
		} else {
			this.minLength = 6;
			this.maxLength = 8;
			this.missingLetters = 2;
			this.timeLimit = 25;
		}

		let word = '';
		let definition = '';
		while (!word || this.usedWords.has(word) || !definition) {
			try {
				const response = await fetch(
					`https://api.datamuse.com/words?sp=${'?'.repeat(this.minLength + Math.floor(Math.random() * (this.maxLength - this.minLength + 1)))}&md=d&max=100`,
				);
				const data = await response.json();
				if (data.length > 0) {
					const selected = data[Math.floor(Math.random() * data.length)];
					word = selected.word;
					definition =
						selected.defs && selected.defs.length > 0
							? selected.defs[0].replace(/^[a-z]+\t/, '')
							: '';
				}
			} catch {
				word = '';
				definition = '';
			}
		}
		this.currentWord = word;
		this.currentDefinition = definition;
		this.obscuredWord = this.obscureWord(word);
	}

	private obscureWord(word: string): string {
		const indices = Array.from({ length: word.length }, (_, i) => i);
		const missingCount = Math.min(this.missingLetters, word.length - 1);
		const missingIndices: number[] = [];
		for (let i = 0; i < missingCount; i++) {
			const randomIndex = indices.splice(
				Math.floor(Math.random() * indices.length),
				1,
			)[0];
			missingIndices.push(randomIndex);
		}
		return word
			.split('')
			.map((char, i) => (missingIndices.includes(i) ? '_' : char))
			.join('');
	}

	private async isValidWord(word: string): Promise<boolean> {
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
		if (this.players.filter(p => p.isActive).length === 0) {
			this.isGameOver = true;
		} else {
			this.advanceTurn();
		}
	}

	private getTurnPrompt(): string {
		const activePlayers = this.players.filter(p => p.isActive);
		if (activePlayers.length === 0)
			return `Game over! No players left.\n\n${this.getRankings()}`;
		if (activePlayers.length === 1) {
			return `Congratulations, @${activePlayers[0].name.split('@')[0]} is the winner with a score of ${activePlayers[0].score}!\n\n${this.getRankings()}`;
		}
		const nextPlayer = this.players[this.currentPlayerIndex].name;
		return `@${nextPlayer.split('@')[0]}'s Turn! Complete the word: ${this.obscuredWord} (${this.minLength}-${this.maxLength} letters).\nHint: ${this.currentDefinition}\nYou have ${this.timeLimit} secs and ${2 - this.players[this.currentPlayerIndex].wrongAttempts} attempt(s) left.`;
	}

	private getRankings(): string {
		const sortedPlayers = [...this.players].sort((a, b) => b.score - a.score);
		return `Final Rankings:\n${sortedPlayers
			.map(
				(p, index) =>
					`${index + 1}. @${p.name.split('@')[0]}: ${p.score} points`,
			)
			.join('\n')}`;
	}

	status(): string {
		const activePlayers = this.players.filter(p => p.isActive);
		if (activePlayers.length === 0)
			return `\`\`\`Game over! No players left.\n\n${this.getRankings()}\`\`\``;
		if (activePlayers.length === 1) {
			return `\`\`\`Congratulations, @${activePlayers[0].name.split('@')[0]} is the winner with a score of ${activePlayers[0].score}!\n\n${this.getRankings()}\`\`\``;
		}
		return `\`\`\`${activePlayers.length} active players. Current turn: ${this.getTurnPrompt()}\`\`\``;
	}
}
