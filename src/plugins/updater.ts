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

		try {
			await execPromise('git fetch');
			const { stdout: logOutput } = await execPromise(
				'git log stable..origin/stable',
			);
			const commits = logOutput.trim().split('\n').filter(Boolean);

			if (match === 'now') {
				if (commits.length === 0) {
					return await message.send(
						'```You are already on the latest version```',
					);
				}

				await message.send('Updating...');
				await execPromise('git stash');
				await execPromise('git pull origin stable');

				await message.send('Installing new dependencies...');
				await new Promise((resolve, reject) => {
					const install = exec('pnpm install', err => {
						if (err) return reject(err);
						resolve(null);
					});
					install.stdout?.pipe(process.stdout);
					install.stderr?.pipe(process.stderr);
				});

				await message.send('Restarting...');
				process.exit(0); // Exit after successful install
			} else {
				if (commits.length === 0) {
					return await message.send(
						'```You are already on the latest version```',
					);
				}

				let changes = 'New update available\n\n';
				changes += `Commits: ${commits.length}\nChanges:\n`;
				commits.forEach((commit, index) => {
					changes += `${index + 1}. ${commit}\n`;
				});
				changes += `\nUse, ${prefix}update now`;
				await message.send(changes);
			}
		} catch (err) {
			await message.send('❌ Update failed:\n```' + err + '```');
		}
	},
});
