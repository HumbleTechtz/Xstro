import { Command } from "../../messaging/plugin.js";
import { updateLeaderboard } from "../../models/leaderboard.js";
import { isLidUser } from "baileys";
const cwgGames = new Map();
const cwgPending = new Map();
Command({
    name: "cwg",
    fromMe: false,
    isGroup: false,
    desc: "Play Complete or Fill in the Gap Game",
    type: "games",
    function: async (message, match) => {
        const jid = message.jid;
        if (match === "end" && cwgGames.has(jid)) {
            const ev = await cwgGames.get(jid).endGame(jid);
            return message.send(ev);
        }
        if (cwgGames.has(jid))
            return message.send("```A Complete or Fill in the Gap Game is already in progress.```");
        if (cwgPending.has(jid))
            return message.send("```A Complete or Fill in the Gap Game is already gathering challengers.```");
        cwgPending.set(jid, { jids: [], timers: [] });
        await message.send('```Complete or Fill in the Gap Game starting! Type "join" to participate.```');
        let countdown = 30;
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                message.send(`\`\`\`Game starting in ${countdown} seconds.\`\`\``);
                countdown -= 10;
            }
            else {
                clearInterval(countdownInterval);
            }
        }, 10000);
        const startTimer = setTimeout(async () => {
            const p = cwgPending.get(jid);
            cwgPending.delete(jid);
            p.timers.forEach(t => clearTimeout(t));
            if (!p.jids.includes(message.sender))
                p.jids.push(message.sender);
            const game = new Cwg(message);
            const result = await game.startGame(p.jids, jid);
            if (result)
                return message.send(result);
            cwgGames.set(jid, game);
            const playersText = p.jids.map(id => `@${id.split("@")[0]}`).join(", ");
            await message.send(`\`\`\`Complete or Fill in the Gap Game started! Challengers: ${playersText}\`\`\``, { mentions: p.jids });
        }, 30000);
        cwgPending.get(jid).timers.push(startTimer);
    },
});
Command({
    on: true,
    function: async (message) => {
        const jid = message.jid;
        const text = message.text?.trim().toLowerCase();
        if (!text)
            return;
        if (text.includes("game started!") ||
            text.includes("complete or fill in the gap") ||
            !message.sender)
            return;
        if (text === "join" && cwgPending.has(jid)) {
            const p = cwgPending.get(jid);
            if (!p.jids.includes(message.sender)) {
                p.jids.push(message.sender);
                return message.send(`\`\`\`@${message.sender.split("@")[0]} joined the Match.\`\`\``, { mentions: [message.sender] });
            }
            return;
        }
        if (cwgGames.has(jid)) {
            const game = cwgGames.get(jid);
            const res = await game.playWord(text, message.sender);
            if (res)
                return message.send(res, {
                    mentions: [game.getCurrentPlayer(), game.getNextPlayer()],
                });
        }
    },
});
class Cwg {
    message;
    originalPlayers = [];
    players = [];
    currentIndex = 0;
    scores = new Map();
    usedWords = new Set();
    active = false;
    timer = null;
    history = [];
    turnNumber = 0;
    startCountdown = null;
    inactivityTimeout = null;
    currentTimeout = 0;
    currentWord = "";
    currentDefinition = "";
    currentIncomplete = "";
    difficultyLevel = 1;
    constructor(message) {
        this.message = message;
    }
    async startGame(jids, jid) {
        if (this.startCountdown)
            clearTimeout(this.startCountdown);
        this.originalPlayers = [...jids];
        this.players = [...jids];
        if (jids.length < 2) {
            this.cleanup(jid);
            return `\`\`\`Insufficient challengers to begin the Complete or Fill in the Gap Game! At least 2 players are required.\`\`\``;
        }
        this.startCountdown = setTimeout(() => this.beginGame(jid), 1000);
        return "";
    }
    async beginGame(jid) {
        if (this.players.length < 2) {
            this.cleanup(jid);
            await this.message.send("```Insufficient challengers to begin the Complete or Fill in the Gap Game! At least 2 players are required.```");
            return;
        }
        this.currentIndex = 0;
        this.scores = new Map(this.players.map(j => [j, 0]));
        this.usedWords.clear();
        this.active = true;
        this.turnNumber = 0;
        this.difficultyLevel = 1;
        await this.prepareNewWord();
        this.scheduleNextTurn(jid);
        const prompt = this.getTurnPrompt();
        await this.message.send(prompt, {
            mentions: [this.players[this.currentIndex]],
        });
    }
    async prepareNewWord() {
        try {
            // Fetch random word from API
            const wordResponse = await fetch("https://random-word-api.herokuapp.com/word");
            const [randomWord] = await wordResponse.json();
            if (!randomWord || this.usedWords.has(randomWord)) {
                // If word is already used or invalid, try again
                return this.prepareNewWord();
            }
            // Fetch definition from dictionary API
            const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
            if (!definitionResponse.ok) {
                // If definition not found, try another word
                return this.prepareNewWord();
            }
            const definitionData = await definitionResponse.json();
            // Get the first definition available
            let definition = "";
            if (definitionData[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
                definition = definitionData[0].meanings[0].definitions[0].definition;
            }
            else {
                // If no definition found, try another word
                return this.prepareNewWord();
            }
            this.currentWord = randomWord.toLowerCase();
            this.currentDefinition = definition;
            this.usedWords.add(this.currentWord);
            // Calculate how many letters to hide based on difficulty
            const lettersToHide = Math.min(Math.floor(this.currentWord.length * (0.2 + this.difficultyLevel * 0.1)), this.currentWord.length - 1);
            // Create incomplete word with gaps
            const wordChars = this.currentWord.split("");
            const hiddenIndices = [];
            while (hiddenIndices.length < lettersToHide) {
                const randomIndex = Math.floor(Math.random() * this.currentWord.length);
                if (!hiddenIndices.includes(randomIndex)) {
                    hiddenIndices.push(randomIndex);
                }
            }
            this.currentIncomplete = wordChars
                .map((char, index) => (hiddenIndices.includes(index) ? "_" : char))
                .join(" ");
        }
        catch (error) {
            console.error("Error fetching word:", error);
            // Fallback to a default word if API fails
            this.currentWord = "example";
            this.currentDefinition = "a representative form or pattern";
            this.currentIncomplete = "e _ a m _ _ e";
        }
    }
    async playWord(input, from) {
        if (!this.active)
            return "";
        const jid = this.players[this.currentIndex];
        if (from !== jid)
            return "";
        const name = jid.split("@")[0];
        const word = input.toLowerCase().trim();
        // Calculate points based on difficulty and word length
        const basePoints = 5 + Math.floor(this.currentWord.length / 2);
        const difficultyMultiplier = 1 + this.difficultyLevel * 0.2;
        const maxPoints = Math.min(80, Math.floor(basePoints * difficultyMultiplier));
        if (word === this.currentWord) {
            // Correct answer
            this.clearTimer();
            this.resetInactivityTimer();
            this.scores.set(jid, (this.scores.get(jid) || 0) + maxPoints);
            this.currentIndex = (this.currentIndex + 1) % this.players.length;
            this.turnNumber++;
            // Increase difficulty every 5 turns
            if (this.turnNumber % 5 === 0) {
                this.difficultyLevel++;
            }
            await this.prepareNewWord();
            this.scheduleNextTurn(this.message.jid);
            const nextPlayer = this.players[this.currentIndex].split("@")[0];
            return `\`\`\`@${name} scores ${maxPoints} points for correctly completing the word "${this.currentWord}"!\n\n@${nextPlayer}, your challenge awaits:\n${this.getTurnPrompt()}\`\`\``;
        }
        else {
            // Incorrect answer
            return this.eliminate(jid, `\`\`\`@${name}, you've been eliminated.\nYour answer "${word}" is incorrect.\nThe correct word was "${this.currentWord}".\`\`\``);
        }
    }
    async eliminate(jid, msg) {
        this.clearTimer();
        this.players = this.players.filter(p => p !== jid);
        if (this.currentIndex >= this.players.length)
            this.currentIndex = 0;
        if (this.players.length <= 1) {
            const endMsg = await this.endGame(this.message.jid);
            await this.message.send(`${msg}\n\n${endMsg}`, {
                mentions: [jid, ...this.originalPlayers],
            });
            return "";
        }
        await this.prepareNewWord();
        this.scheduleNextTurn(this.message.jid);
        const nextPlayer = this.players[this.currentIndex];
        const nextPlayerName = nextPlayer.split("@")[0];
        return `${msg}\n\n\`\`\`@${nextPlayerName}, your challenge awaits:\n${this.getTurnPrompt()}\`\`\``;
    }
    getCurrentTimeout() {
        // Decrease time as difficulty increases
        this.currentTimeout = Math.max(10000, 30000 - this.difficultyLevel * 2000);
        return this.currentTimeout;
    }
    scheduleNextTurn(jid) {
        const timeout = this.getCurrentTimeout();
        if (!this.active || !this.players.length) {
            this.cleanup(jid);
            return;
        }
        this.clearTimer();
        this.timer = setTimeout(async () => {
            if (this.active && this.players.length) {
                const playerJid = this.players[this.currentIndex];
                const name = playerJid.split("@")[0];
                const message = `\`\`\`@${name}, you've been eliminated from the Complete or Fill in the Gap Game!\nYou ran out of time to submit an answer.\`\`\``;
                const out = await this.eliminate(playerJid, message);
                if (out) {
                    await this.message.send(out, {
                        mentions: this.players.length ? [this.players[this.currentIndex]] : [],
                    });
                }
            }
            else {
                this.cleanup(jid);
            }
        }, timeout);
    }
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    resetInactivityTimer() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        this.inactivityTimeout = setTimeout(async () => {
            if (this.active) {
                const endMsg = await this.forceEndGame(this.message.jid);
                await this.message.send(endMsg, {
                    mentions: this.players.length ? this.originalPlayers : [],
                });
            }
        }, 60000);
    }
    async endGame(jid) {
        const scoreArray = this.originalPlayers.map(p => [
            p,
            this.scores.get(p) || 0,
        ]);
        scoreArray.sort((a, b) => b[1] - a[1]);
        const scoreText = scoreArray
            .map(([p, s]) => `@${p.split("@")[0]}: ${s} points`)
            .join("\n");
        const result = scoreArray[0]
            ? `\`\`\`@${scoreArray[0][0].split("@")[0]} claims victory in this Match with ${scoreArray[0][1]} points!\n\nRankings:\n${scoreText}\`\`\``
            : `\`\`\`The Complete or Fill in the Gap Game has concluded!\n\nRankings:\n${scoreText}\`\`\``;
        const validPlayers = this.originalPlayers.filter(userId => isLidUser(userId));
        await updateLeaderboard(validPlayers.map(userId => ({
            userId,
            score: this.scores.get(userId) || 0,
        })));
        this.cleanup(jid);
        return result;
    }
    async forceEndGame(jid) {
        const scoreArray = this.originalPlayers.map(p => [
            p,
            this.scores.get(p) || 0,
        ]);
        scoreArray.sort((a, b) => b[1] - a[1]);
        const scoreText = scoreArray
            .map(([p, s]) => `@${p.split("@")[0]}: ${s} points`)
            .join("\n");
        const result = scoreArray[0]
            ? `\`\`\`@${scoreArray[0][0].split("@")[0]} claims victory in the Complete or Fill in the Gap Game with ${scoreArray[0][1]} points due to inactivity!\n\nRankings:\n${scoreText}\`\`\``
            : `\`\`\`The Complete or Fill in the Gap Game has concluded due to inactivity!\n\nRankings:\n${scoreText}\`\`\``;
        const validPlayers = this.originalPlayers.filter(userId => isLidUser(userId));
        await updateLeaderboard(validPlayers.map(userId => ({
            userId,
            score: this.scores.get(userId) || 0,
        })));
        this.cleanup(jid);
        return result;
    }
    cleanup(jid) {
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
        this.currentIndex = 0;
        this.turnNumber = 0;
        this.history = [];
        this.currentTimeout = 0;
        this.difficultyLevel = 1;
        this.currentWord = "";
        this.currentDefinition = "";
        this.currentIncomplete = "";
        cwgGames.delete(jid);
    }
    getTurnPrompt() {
        if (!this.active || !this.players.length)
            return "";
        return `Complete the word:\n${this.currentIncomplete}\n\nDefinition: ${this.currentDefinition}\n\nDifficulty: Level ${this.difficultyLevel}\nYou have ${this.currentTimeout / 1000} seconds to respond!`;
    }
    getCurrentPlayer() {
        return this.players[this.currentIndex] || "";
    }
    getNextPlayer() {
        return this.players[(this.currentIndex + 1) % this.players.length] || "";
    }
}
