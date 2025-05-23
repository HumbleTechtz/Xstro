import test, { beforeEach, describe } from 'node:test';
import assert from 'node:assert/strict';
import Wcg from '../src/plugins/Helpers/Wcg.ts';

const originalFetch = global.fetch;
beforeEach(() => {
	global.fetch = async (input: RequestInfo | URL) => {
		const url =
			typeof input === 'string'
				? input
				: input instanceof URL
					? input.toString()
					: (input as Request).url;
		const word = new URL(url).searchParams.get('sp') || '';
		if (word === 'xyzzy' || word === 'buckte') {
			return { json: async () => [] } as Response; // Invalid words
		}
		return {
			json: async () => [{ word }],
		} as Response; // Valid word
	};
});
test.after(() => {
	global.fetch = originalFetch; // Restore fetch
});

describe('Wcg', () => {
	let game: Wcg;

	beforeEach(() => {
		game = new Wcg();
		// Override timeLimits for faster testing
		game['timeLimits'] = { easy: 5, medium: 4, hard: 3 };
	});

	test('starts game in easy mode', async () => {
		const result = await game.startGame('easy', ['Alice', 'Bob']);
		assert.match(result, /Game Started!/);
		assert.match(result, /Players:\nAlice\nBob/);
		assert.match(
			result,
			/Alice's Turn! You have 5 secs to provide a 3\+ letter word that starts with the letter "A"/,
		);
	});

	test('starts game in medium mode', async () => {
		const result = await game.startGame('medium', ['Alice', 'Bob']);
		assert.match(result, /Game Started!/);
		assert.match(
			result,
			/Alice's Turn! You have 4 secs to provide a 5\+ letter word that starts with the letter "A"/,
		);
	});

	test('accepts valid word and chains', async () => {
		await game.startGame('easy', ['Alice', 'Bob']);
		const result = await game.playWord('apple');
		assert.match(result, /Correct!/);
		assert.match(
			result,
			/Bob's Turn! You have 5 secs to provide a 3\+ letter word that starts with the letter "E"/,
		);
	});

	test('rejects short word in medium mode', async () => {
		await game.startGame('medium', ['Alice', 'Bob']);
		const result = await game.playWord('cat');
		assert.match(result, /Sorry, "cat" is not a valid word/);
		assert.match(result, /Alice is kicked out from the Game!/);
		assert.match(result, /Congratulations, Bob is the winner/);
	});

	test('rejects invalid word', async () => {
		await game.startGame('easy', ['Alice', 'Bob']);
		const result = await game.playWord('xyzzy');
		assert.match(result, /Sorry, "xyzzy" is not a valid word/);
		assert.match(result, /Alice is kicked out from the Game!/);
		assert.match(result, /Congratulations, Bob is the winner/);
	});

	test('rejects used word', async () => {
		await game.startGame('easy', ['Alice', 'Bob']);
		await game.playWord('apple');
		await game.playWord('egg');
		const result = await game.playWord('apple');
		assert.match(result, /Oops, "apple" has already been used/);
		assert.match(result, /Alice is kicked out from the Game!/);
		assert.match(result, /Congratulations, Bob is the winner/);
	});

	test('rejects non-chaining word', async () => {
		await game.startGame('easy', ['Alice', 'Bob']);
		await game.playWord('apple');
		const result = await game.playWord('sun');
		assert.match(result, /Uh-oh, "sun" doesn't start with the letter "e"/);
		assert.match(result, /Bob is kicked out from the Game!/);
		assert.match(result, /Congratulations, Alice is the winner/);
	});

	test('handles timeout', { timeout: 8000 }, async () => {
		await game.startGame('easy', ['Alice', 'Bob']);
		const resultPromise = game.startTurnTimer();
		await new Promise(resolve => setTimeout(resolve, 5100)); // Wait for 5s timer
		const result = await resultPromise;
		assert.match(
			result,
			/Alice, your time is up! You are kicked out of the game/,
		);
		assert.match(result, /Congratulations, Bob is the winner/);
	});

	test('declares winner', async () => {
		await game.startGame('easy', ['Alice', 'Bob']);
		await game.playWord('xyzzy');
		const result = await game.status();
		assert.match(
			result,
			/Congratulations, Bob is the winner with a score of 0!/,
		);
	});
});
