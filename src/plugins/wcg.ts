import { Command } from '../messaging/plugin.ts';
import Wcg from './Helpers/Wcg.ts';

const gameStates = new Map();

Command({
	name: 'wcg',
	fromMe: false,
	desc: 'Start a Word Chain Game',
	type: 'fun',
	function: async (message, match) => {
		const chatId = message.key.remoteJid;

		if (!match) {
			return await message.send(
				'_Please provide a mode: easy, medium, or hard._\n\n*Example:*\n`' +
					message.prefix[0] +
					'wcg easy`',
			);
		}

		const choice = match.trim().toLowerCase();

		if (choice === 'end') {
			if (gameStates.has(chatId)) {
				gameStates.delete(chatId);
				return await message.send('```Game ended successfully.```');
			} else {
				return await message.send('```No game found to end!```');
			}
		}

		const mode = choice;
		if (!['easy', 'medium', 'hard'].includes(mode)) {
			return await message.send(
				'_Invalid mode. Please choose: easy, medium, or hard._\n\n*Example:*\n`' +
					message.prefix[0] +
					'wcg easy`',
			);
		}

		if (gameStates.has(chatId)) {
			return await message.send(
				'_A game is already in progress or starting in this chat! Please wait._',
			);
		}

		gameStates.set(chatId, {
			mode,
			players: new Set(),
			isJoining: true,
			game: null,
		});

		await message.send(
			'```Waiting for players to join, type "join" to join!```',
		);

		setTimeout(async () => {
			await message.send('```20 seconds left.```');
		}, 10000);

		setTimeout(async () => {
			await message.send('```10 seconds left.```');
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

			const msg = await game.startGame(mode, playerNames);
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
