import { Command } from '../messaging/plugin.ts';
import Cwg from './Helpers/Cwg.ts';
import Wcg from './Helpers/Wcg.ts';

const gameStates = new Map();

Command({
	name: 'cwg',
	fromMe: false,
	desc: 'Start a Complete the Word Game',
	type: 'games',
	function: async (message, match) => {
		const chatId = message.jid;

		if (match && match.trim().toLowerCase() === 'end') {
			if (gameStates.has(chatId)) {
				gameStates.delete(chatId);
				return await message.send('```Game ended successfully.```');
			} else {
				return await message.send('```No game found to end!```');
			}
		}

		if (gameStates.has(chatId)) {
			return await message.send(
				'_A game is already in progress or starting in this chat! Please wait._',
			);
		}

		gameStates.set(chatId, {
			players: new Set(),
			isJoining: true,
			game: null,
		});

		await message.send(
			'```Complete the Word Game starting! Type "join" to participate. Fill in missing letters to complete words. Difficulty increases with longer words and shorter time limits (down to 15s).```',
		);

		setTimeout(async () => {
			await message.send('```20 seconds left to join!```');
		}, 10000);

		setTimeout(async () => {
			await message.send('```10 seconds left to join!```');
		}, 20000);

		setTimeout(async () => {
			const state = gameStates.get(chatId);
			if (!state) return;

			state.isJoining = false;

			if (state.players.size === 0) {
				await message.send('```No players joined! Game cancelled.```');
				gameStates.delete(chatId);
				return;
			}

			const playerNames = Array.from(state.players) as string[];
			const game = new Cwg();
			state.game = game;

			const msg = await game.startGame(playerNames);
			await message.send(msg, { mentions: playerNames });

			const timeoutResult = await game.startTurnTimer();
			await message.send(timeoutResult, { mentions: playerNames });

			if (
				timeoutResult.includes('Congratulations') ||
				timeoutResult.includes('Game over')
			) {
				gameStates.delete(chatId);
			}
		}, 30000);
	},
});

Command({
	on: true,
	dontAddCommandList: true,
	function: async message => {
		const text = message.text;
		const sender = message.sender!;
		const chatId = message.key.remoteJid;
		if (!text || !sender || !chatId || message.prefix.includes(text)) return;

		const state = gameStates.get(chatId);
		if (!state) return;

		if (state.isJoining) {
			if (text.toLowerCase() !== 'join') return;
			if (state.players.has(sender)) {
				return await message.send('```You have already joined!```');
			}
			state.players.add(sender);
			return await message.send(
				`\`\`\`@${sender.split('@')[0]} has joined!\`\`\``,
				{ mentions: [sender] },
			);
		}

		if (!state.game || !state.players.has(sender)) return;

		const words = text.trim().split(/\s+/);
		if (words.length !== 1) return;

		const currentPlayerIndex = state.game['currentPlayerIndex'];
		const players = state.game['players'];
		if (!players || currentPlayerIndex >= players.length) return;

		const currentPlayerName = players[currentPlayerIndex].name;
		if (currentPlayerName !== sender) return;

		const result = await state.game.playWord(text);
		await message.send(result, { mentions: players.map((p: any) => p.name) });

		if (!result.includes('Congratulations') && !result.includes('Game over')) {
			const timeoutResult = await state.game.startTurnTimer();
			await message.send(timeoutResult, {
				mentions: players.map((p: any) => p.name),
			});
		}

		if (result.includes('Congratulations') || result.includes('Game over')) {
			gameStates.delete(chatId);
		}
	},
});

Command({
	name: 'wcg',
	fromMe: false,
	desc: 'Start a Word Chain Game',
	type: 'games',
	function: async (message, match) => {
		const chatId = message.jid;

		if (match && match.trim().toLowerCase() === 'end') {
			if (gameStates.has(chatId)) {
				gameStates.delete(chatId);
				return await message.send('```Game ended successfully.```');
			} else {
				return await message.send('```No game found to end!```');
			}
		}

		if (gameStates.has(chatId)) {
			return await message.send(
				'_A game is already in progress or starting in this chat! Please wait._',
			);
		}

		gameStates.set(chatId, {
			players: new Set(),
			isJoining: true,
			game: null,
		});

		await message.send(
			'```Word Chain Game starting! Type "join" to participate. The game gets harder each round with shorter time limits (down to 12s) and longer words required.```',
		);

		setTimeout(async () => {
			await message.send('```20 seconds left to join!```');
		}, 10000);

		setTimeout(async () => {
			await message.send('```10 seconds left to join!```');
		}, 20000);

		setTimeout(async () => {
			const state = gameStates.get(chatId);
			if (!state) return;

			state.isJoining = false;

			if (state.players.size === 0) {
				await message.send('```No players joined! Game cancelled.```');
				gameStates.delete(chatId);
				return;
			}

			const playerNames = Array.from(state.players) as string[];
			const game = new Wcg();
			state.game = game;

			const msg = await game.startGame(playerNames);
			await message.send(msg, { mentions: playerNames });

			const timeoutResult = await game.startTurnTimer();
			await message.send(timeoutResult, { mentions: playerNames });

			if (
				timeoutResult.includes('Congratulations') ||
				timeoutResult.includes('Game over')
			) {
				gameStates.delete(chatId);
			}
		}, 30000);
	},
});

Command({
	on: true,
	dontAddCommandList: true,
	function: async message => {
		const text = message.text;
		const sender = message.sender;
		const chatId = message.key.remoteJid;
		if (!text || !sender || !chatId || message.prefix.includes(text)) return;

		const state = gameStates.get(chatId);
		if (!state) return;

		if (state.isJoining) {
			if (text.toLowerCase() !== 'join') return;
			if (state.players.has(sender)) {
				return await message.send('```You have already joined!```');
			}
			state.players.add(sender);
			return await message.send(
				`\`\`\`@${sender.split('@')[0]} has joined!\`\`\``,
				{ mentions: [sender] },
			);
		}

		if (!state.game || !state.players.has(sender)) return;

		const words = text.trim().split(/\s+/);
		if (words.length !== 1) return;

		const currentPlayerIndex = state.game['currentPlayerIndex'];
		const players = state.game['players'];
		if (!players || currentPlayerIndex >= players.length) return;

		const currentPlayerName = players[currentPlayerIndex].name;
		if (currentPlayerName !== sender) return;

		const result = await state.game.playWord(text);
		await message.send(result, { mentions: players.map((p: any) => p.name) });

		if (!result.includes('Congratulations') && !result.includes('Game over')) {
			const timeoutResult = await state.game.startTurnTimer();
			await message.send(timeoutResult, {
				mentions: players.map((p: any) => p.name),
			});
		}

		if (result.includes('Congratulations') || result.includes('Game over')) {
			gameStates.delete(chatId);
		}
	},
});
