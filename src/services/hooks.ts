import {
	checkGitRepoUpToDate,
	fetchAndUpdateGroups,
	loadPlugins,
	socketHooks,
} from "lib";
import type { WASocket } from "baileys";


export default async (jobs: WASocket) => {
// Check our current version
	// Load plugins and update group metadata in parallel.
	// Promise.allSettled so that one failure doesn't prevent the other.
	await Promise.allSettled([
		checkGitRepoUpToDate(undefined, undefined, "stable"),
		loadPlugins(), //  load all available plugins, located at assets folder
		fetchAndUpdateGroups(jobs), // Initially Sync groups for early caching
	]);

	// After setup, register socket event handlers (e.g., message, group updates, etc.)
	return socketHooks(jobs);
};
