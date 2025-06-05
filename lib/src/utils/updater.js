import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);
export async function update(applyUpdate = false) {
    try {
        await execPromise("git fetch");
        const { stdout: logOutput } = await execPromise("git log stable..origin/stable");
        const commits = logOutput.trim().split("\n").filter(Boolean);
        if (applyUpdate) {
            if (commits.length === 0)
                return { status: "up-to-date" };
            await execPromise("git stash && git pull origin stable");
            return { status: "updated" };
        }
        else {
            if (commits.length === 0)
                return { status: "up-to-date" };
            return { status: "updates-available", commits };
        }
    }
    catch (err) {
        return { status: "error", error: String(err) };
    }
}
