import { exec } from "child_process";

function execPromise(
	command: string
): Promise<{ stdout: string; stderr: string }> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) reject(error);
			else resolve({ stdout, stderr });
		});
	});
}

export function update(applyUpdate = false) {
	return new Promise(async resolve => {
		try {
			await execPromise("git fetch");
			const { stdout: logOutput } = await execPromise(
				"git log stable..origin/stable"
			);
			const commits = logOutput.trim().split("\n").filter(Boolean);

			if (applyUpdate) {
				if (commits.length === 0) return resolve({ status: "up-to-date" });
				await execPromise("git stash && git pull origin stable");
				return resolve({ status: "updated" });
			} else {
				if (commits.length === 0) return resolve({ status: "up-to-date" });
				return resolve({ status: "updates-available", commits });
			}
		} catch (err) {
			return resolve({ status: "error", error: String(err) });
		}
	});
}
