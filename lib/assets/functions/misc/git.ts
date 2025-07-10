import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

export async function fetchRepo(
	repoUrl: string,
	branch?: string
): Promise<string | string[]> {
	const repoPath = repoUrl.replace("https://github.com/", "");
	const apiUrl = `https://api.github.com/repos/${repoPath}`;
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "git-repo-"));

	try {
		const branches = await (await fetch(`${apiUrl}/branches`)).json();
		const branchNames = branches.map((b: any) => b.name);

		if (!branch && branchNames.length === 1) {
			return `${apiUrl}/zipball/${branchNames[0]}`;
		}

		if (branch && branchNames.includes(branch)) {
			return `${apiUrl}/zipball/${branch}`;
		}

		return branchNames;
	} catch (error) {
		throw new Error(`Failed to fetch repository: ${error.message}`);
	} finally {
		if (
			await fs
				.access(tempDir)
				.then(() => true)
				.catch(() => false)
		) {
			await fs.rm(tempDir, { recursive: true, force: true });
		}
	}
}
