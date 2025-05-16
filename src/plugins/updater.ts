import { exec } from 'child_process';
import { promisify } from 'util';
import { print } from '../utils/index.ts';
import { Command } from '../messaging/plugin.ts';

const execPromise = promisify(exec);

Command({
	name: 'update',
	fromMe: true,
	isGroup: false,
	desc: 'Update the bot',
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
				return await message.send('No changes in the latest commit');
			}

			await message.send('Updating...');
			await execPromise('git stash && git pull origin ' + 'stable');

			await message.send('Restarting...');
			const dependencyChanged = await updatedDependencies();

			if (dependencyChanged) {
				await message.send('Dependancies changed installing new dependancies');
				await message.send('Restarting...');
				await execPromise('pnpm install');
				process.exit();
			} else {
				await message.send('Restarting...');
				process.exit();
			}
		} else {
			if (commits.length === 0) {
				return await message.send('No changes in the latest commit');
			}

			let changes = 'New update available!\n\n';
			changes += 'Commits: ' + commits.length + '\n';
			changes += 'Changes: \n';
			commits.forEach((commit: string, index: number) => {
				changes += index + 1 + '. ' + commit + '\n';
			});
			changes += '\nTo update, send ' + prefix + 'update now';
			await message.send(changes);
		}
	},
});

async function updatedDependencies(): Promise<boolean> {
	try {
		const { stdout: diff } = await execPromise(
			'git diff stable..origin/stable',
		);
		return diff.includes('"dependencies":');
	} catch (error) {
		print.fail(JSON.stringify(error));
		return false;
	}
}
