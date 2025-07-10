import { CommandModule } from "@types";
import { extractUrlFromText } from "baileys";
import { fetchRepo } from "../functions";

const pendingDownloads = new Map();

export default [
	{
		pattern: "git",
		fromMe: false,
		isGroup: false,
		desc: "Downloads a github repository",
		type: "utils",
		handler: async (msg, args) => {
			args = extractUrlFromText(args);
			if (
				!args ||
				!/^https:\/\/github\.com\/[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}\/[a-zA-Z0-9._-]+$/.test(
					args
				)
			) {
				return msg.send("Provide a valid GitHub repo URL");
			}

			const repo = await fetchRepo(args);
			if (typeof repo === "string") return msg.send(repo);

			const branchList = repo
				.map((branch: string, index: number) => `${index + 1}. ${branch}`)
				.join("\n");
			const reply = await msg.send(
				`Repo has multiple branches:\n${branchList}\nReply with a number to choose a branch`
			);
			pendingDownloads.set(reply.key.id, { args, branches: repo });
		},
	},
	{
		on: "download_choice",
		handler: async msg => {
			const replyId = msg.quoted?.key.id;
			if (!replyId || !pendingDownloads.has(replyId)) return;

			const { args, branches } = pendingDownloads.get(replyId);
			const choice = parseInt(msg.text.trim()) - 1;

			if (isNaN(choice) || choice < 0 || choice >= branches.length)
				return msg.send("Reply with a number.");

			const res = await fetchRepo(args, branches[choice]);
			pendingDownloads.delete(replyId);

			if (typeof res === "string") return msg.send(res);
			return msg.send("Failed to fetch repository URL");
		},
	},
] satisfies CommandModule[];
