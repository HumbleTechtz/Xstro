interface Player {
	name: string;
	score: number;
	isActive: boolean;
}

export default class Wcg {
	private currentWord = '';
	private usedWords = new Set<string>();
	private isGameOver = false;
	private minLength = 3;
	private players: Player[] = [];
	private currentPlayerIndex = 0;
	private cycleCount = 0; // Tracks completed cycles
	private timeLimit = 55; // Start at 55 seconds
	private timeoutId: NodeJS.Timeout | null = null;

	async startGame(playerNames: string[]): Promise<string> {
		this.currentWord = '';
		this.usedWords.clear();
		this.isGameOver = false;
		this.minLength = 3;
		this.cycleCount = 0;
		this.timeLimit = 55;
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
			return `\`\`\`Game over! No players left.\n\n${this.getRankings()}\`\`\``;
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
			return `\`\`\`Correct! @${player.name.split('@')[0]} scores ${word.length} points (total: ${player.score}).\n\nCongratulations, @${activePlayers[0].name.split('@')[0]} is the winner with a score of ${activePlayers[0].score}!\n\n${this.getRankings()}\`\`\``;
		}

		return `\`\`\`Correct! @${player.name.split('@')[0]} scores ${word.length} points (total: ${player.score}).\n\n${this.getTurnPrompt()}\`\`\``;
	}

	startTurnTimer(): Promise<string> {
		return new Promise(resolve => {
			this.timeoutId = setTimeout(() => {
				const player = this.players[this.currentPlayerIndex];
				this.removePlayer();
				const message = `\`\`\`@${player.name.split('@')[0]}, your time is up! You are kicked out of the game.\n\n${this.getTurnPrompt()}\`\`\``;
				resolve(message);
			}, this.timeLimit * 1000);
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
		const prevIndex = this.currentPlayerIndex;
		this.currentPlayerIndex =
			(this.currentPlayerIndex + 1) % this.players.length;
		// Check if we've completed a cycle (back to first player or past last active player)
		if (
			this.currentPlayerIndex <= prevIndex &&
			this.players.filter(p => p.isActive).length > 0
		) {
			this.cycleCount++;
			this.updateDifficulty();
		}
		while (
			!this.players[this.currentPlayerIndex].isActive &&
			this.players.filter(p => p.isActive).length > 0
		) {
			this.currentPlayerIndex =
				(this.currentPlayerIndex + 1) % this.players.length;
			// Check for cycle completion again if skipping inactive players
			if (
				this.currentPlayerIndex <= prevIndex &&
				this.players.filter(p => p.isActive).length > 0
			) {
				this.cycleCount++;
				this.updateDifficulty();
			}
		}
	}

	private updateDifficulty(): void {
		switch (this.cycleCount) {
			case 0:
				this.minLength = 3;
				this.timeLimit = 55;
				break;
			case 1:
				this.minLength = 4;
				this.timeLimit = 45;
				break;
			case 2:
				this.minLength = 5;
				this.timeLimit = 35;
				break;
			case 3:
				this.minLength = 6;
				this.timeLimit = 25;
				break;
			case 4:
				this.minLength = 7;
				this.timeLimit = 15;
				break;
			default:
				this.minLength = 8;
				this.timeLimit = 15;
				break;
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
		const nextLetter = this.currentWord
			? this.currentWord.slice(-1).toUpperCase()
			: 'A';
		return `@${nextPlayer.split('@')[0]}'s Turn! You have ${this.timeLimit} secs to provide a ${this.minLength}+ letter word that starts with the letter "${nextLetter}"`;
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
