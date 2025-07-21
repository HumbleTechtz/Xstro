import { execSync } from "child_process";
import { Green, Red, Yellow } from "./console.ts";
import { cwd } from "process";
import { en } from "../resources/index.ts";

export function checkGitRepoUpToDate(
	repoPath?: string,
	remote: string = "origin",
	branch: string = "main"
): void {
	process.chdir(repoPath ?? cwd());
	execSync(`git fetch ${remote}`);
	const localHash = execSync(`git rev-parse ${branch}`).toString().trim();
	const remoteHash = execSync(`git rev-parse ${remote}/${branch}`)
		.toString()
		.trim();
	if (localHash === remoteHash) {
		Green(`${en.update.uptodate}\nHash: ${localHash}`);
	} else {
		const localCommit = execSync(`git log -1 ${localHash} --pretty=%h:%s:%an:%ad`)
			.toString()
			.trim();
		const remoteCommit = execSync(
			`git log -1 ${remoteHash} --pretty=%h:%s:%an:%ad`
		)
			.toString()
			.trim();
		Yellow(en.update.outofdate);
		Red(`Lastest: false: ${localCommit}`);
		Yellow(`Latest Version: ${remoteCommit}`);
	}
}
