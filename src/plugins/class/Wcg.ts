import type { Message } from "../../class/index.ts";
import { getRandom } from "./utils/math.ts";
import { isValidWord } from "./utils/word-check.ts";
import { getTimeFrame } from "./utils/countdown.ts";

export class WcgGame {
  usedWords: string[];
  eliminatedPlayers: string[];
  requiredLength: number;
  letters: string[];
  mode: "easy" | "medium" | "hard";
  currentPlayer: string;
  lastWord: string;
  playerList: string[];
  currentPlayerIndex: number;
  timeLimit: number;
  turnStartTime: number;
  turnCount: number;

  constructor(
    private msg: Message,
    private players: Map<string, boolean>,
    private chatId: Map<string, boolean>,
    private scores: Map<string, string>,
  ) {
    this.usedWords = [];
    this.eliminatedPlayers = [];
    this.requiredLength = 3;
    this.letters = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(97 + i),
    );
    this.mode = "easy";
    this.playerList = Array.from(this.players.keys());
    this.currentPlayerIndex = 0;
    this.currentPlayer = this.playerList[0];
    this.lastWord = "";
    this.timeLimit = 0;
    this.turnStartTime = Date.now();
    this.turnCount = 0;

    this.playerList.forEach((player) => {
      if (!this.scores.has(player)) {
        this.scores.set(player, "0");
      }
    });

    this.start();
  }

  start() {
    const startLetter = this.getChar().toUpperCase();
    this.lastWord = startLetter.toLowerCase();
    this.timeLimit = getTimeFrame(this.mode, this.playerList.length);

    const playerName = this.currentPlayer.split("@")[0];

    this.msg.client.sendMessage(this.msg.from, {
      text: `\`\`\`Word Chain Game Started\n@${playerName} You start first, Provide a Word that Starts with the Letter "${startLetter}"\nYou have ${this.timeLimit} seconds\`\`\``,
      mentions: [this.currentPlayer],
    });
  }

  async handleWord(word: string, playerId: string): Promise<void> {
    if (playerId !== this.currentPlayer) return;
    if (this.eliminatedPlayers.includes(playerId)) return;

    if (Date.now() - this.turnStartTime > this.timeLimit * 1000) {
      this.eliminate(playerId, "Time up");
      return;
    }

    const w = word.toLowerCase().trim();

    if (!/^[a-z]+$/.test(w)) return;

    const reqLetter = this.getReqLetter();
    if (w[0] !== reqLetter) return;

    if (this.usedWords.includes(w)) {
      this.eliminate(playerId, "Word used");
      return;
    }

    if (!(await this.vaildateWord(w))) {
      this.eliminate(playerId, "Invalid word");
      return;
    }

    this.usedWords.push(w);
    this.lastWord = w;
    this.turnCount++;

    const currentScore = parseInt(this.scores.get(playerId) || "0");
    this.scores.set(playerId, (currentScore + w.length).toString());

    this.updateMode();
    this.nextTurn();

    if (this.getActivePlayers().length <= 1) {
      this.chatId.delete(this.msg.from);
      const winner = this.getActivePlayers()[0];
      this.msg.client.sendMessage(this.msg.from, {
        text: `\`\`\`Game Over\nWinner: ${winner.split("@")[0]}\`\`\``,
        mentions: [winner],
      });
      return;
    }

    const nextLetter = w[w.length - 1].toUpperCase();
    const nextPlayerName = this.currentPlayer.split("@")[0];

    this.msg.client.sendMessage(this.msg.from, {
      text: `\`\`\`@${nextPlayerName} Your turn\nProvide a word starting with "${nextLetter}"\nYou have ${this.timeLimit} seconds\`\`\``,
      mentions: [this.currentPlayer],
    });
  }

  async vaildateWord(word: string) {
    if (word.length < this.requiredLength) return false;
    return await isValidWord(word);
  }

  getChar() {
    return getRandom(this.letters);
  }

  private updateMode() {
    if (this.turnCount >= 20) this.mode = "hard";
    else if (this.turnCount >= 10) this.mode = "medium";
    else this.mode = "easy";
  }

  private getReqLetter() {
    return this.lastWord.length === 1
      ? this.lastWord
      : this.lastWord[this.lastWord.length - 1];
  }

  private nextTurn() {
    do {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.playerList.length;
      this.currentPlayer = this.playerList[this.currentPlayerIndex];
    } while (this.eliminatedPlayers.includes(this.currentPlayer));

    this.timeLimit = getTimeFrame(this.mode, this.getActivePlayers().length);
    this.turnStartTime = Date.now();
  }

  private eliminate(playerId: string, reason: string) {
    this.eliminatedPlayers.push(playerId);

    if (this.getActivePlayers().length <= 1) {
      this.chatId.delete(this.msg.from);
      const winner = this.getActivePlayers()[0];
      if (winner) {
        this.msg.client.sendMessage(this.msg.from, {
          text: `\`\`\`Game Over\nWinner: ${winner.split("@")[0]}\`\`\``,
          mentions: [winner],
        });
      } else {
        this.msg.client.sendMessage(this.msg.from, {
          text: `\`\`\`Game Over\nNo winner\`\`\``,
          mentions: [],
        });
      }
      return;
    }

    this.nextTurn();
    const nextLetter = this.getReqLetter().toUpperCase();
    const nextPlayerName = this.currentPlayer.split("@")[0];

    this.msg.client.sendMessage(this.msg.from, {
      text: `\`\`\`${playerId.split("@")[0]} eliminated: ${reason}\n@${nextPlayerName} Your turn\nProvide a word starting with "${nextLetter}"\nYou have ${this.timeLimit} seconds\`\`\``,
      mentions: [this.currentPlayer],
    });
  }

  private getActivePlayers() {
    return this.playerList.filter((p) => !this.eliminatedPlayers.includes(p));
  }
}
