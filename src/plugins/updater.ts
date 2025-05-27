import { exec } from 'child_process';
import { promisify } from 'util';
import { Command } from '../messaging/plugin.ts';
import { delay } from 'baileys';

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
				const installation = await execPromise('pnpm install');
				await message.send(
					`\`\`\`'Dependencies updated'\n${installation.stdout}\`\`\``,
				);
				await delay(2000);
				await message.send('Restarting...');
				process.exit(0);
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
