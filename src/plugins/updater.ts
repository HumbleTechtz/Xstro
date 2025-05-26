import { exec } from 'child_process';
import { promisify } from 'util';
import { Command } from '../messaging/plugin.ts';

const execPromise = promisify(exec);

Command({
	name: 'update',
	fromMe: true,
	isGroup: false,
	desc: 'Update the bot and dependencies',
	type: 'utilities',
	function: async (message, match) => {
		const prefix = message.prefix[0];
		await execPromise('git fetch');

		const { stdout: logOutput } = await execPromise(
			'git log stable..origin/stable',
		);
		const commits = logOutput.split('\n').filter(Boolean);

		if (match === 'now') {
			if (commits.length === 0) {
				return await message.send(
					'```You are already on the latest version```',
				);
			}

			await message.send('Updating...');
			await execPromise('git stash && git pull origin ' + 'stable');
			await message.send('Installing new dependancies');
			await message.send('Restarting...');
			await execPromise('pnpm install');
			process.exit();
		} else {
			if (commits.length === 0) {
				return await message.send(
					'```You are already on the latest version```',
				);
			}

			let changes = 'New update available\n\n';
			changes += 'Commits: ' + commits.length + '\n';
			changes += 'Changes: \n';
			commits.forEach((commit: string, index: number) => {
				changes += index + 1 + '. ' + commit + '\n';
			});
			changes += '\nUse, ' + prefix[0] + 'update now';
			await message.send(changes);
		}
	},
});
