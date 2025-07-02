import { CommandModule } from "../client";
import { getJson } from "../common";

interface YouTubeSearchResult {
	success: boolean;
	result: {
		type: string;
		videoId: string;
		url: string;
		title: string;
		description: string;
		image: string;
		thumbnail: string;
		seconds: number;
		timestamp: string;
		duration: {
			seconds: number;
			timestamp: string;
		};
		views: number;
		author: {
			name: string;
			url: string;
		};
		download: {
			audio: string;
			video: string;
		};
	};
}

const pendingDownloads = new Map<string, { audio: string; video: string }>();

export default [
	{
		pattern: "play",
		fromMe: false,
		isGroup: false,
		desc: "Download Music",
		type: "download",
		run: async (msg, args) => {
			if (!args) return msg.send("Provide a song name");

			const result = await getJson<YouTubeSearchResult>(
				`https://ochinpo-helper.hf.space/yt?query=${encodeURIComponent(args)}`
			);

			if (!result.success) {
				return msg.send("No results found for your search");
			}

			const { title, description, image, views, author, duration, download } =
				result.result;

			const details =
				`🎵 *${title}*\n\n` +
				`👤 *Artist:* ${author.name}\n` +
				`⏱️ *Duration:* ${duration.timestamp}\n` +
				`👁️ *Views:* ${views.toLocaleString()}\n\n` +
				`📝 *Description:* ${description.substring(0, 100)}...` +
				`Select download option:\n\n` +
				`1️ Audio Only (MP3)\n` +
				`2️ Video (MP4)\n\n` +
				`Reply with 1 or 2`;

			const options = await msg.send(image, { caption: details });

			pendingDownloads.set(options.key.id!, download);
		},
	},
	{
		on: true,
		run: async (msg, args) => {
			if (!msg.quoted?.key?.id) return;

			const downloadData = pendingDownloads.get(msg.quoted.key.id);
			if (!downloadData) return;

			const choice = msg.text?.trim();

			if (choice === "1") {
				await msg.send("🎵 Downloading audio...");
				await msg.send(downloadData.audio);
			} else if (choice === "2") {
				await msg.send("🎬 Downloading video...");
				await msg.send(downloadData.video);
			} else {
				return msg.send("Invalid choice. Reply with 1 or 2");
			}
			msg.delete(msg.quoted);
			pendingDownloads.delete(msg.quoted.key.id);
		},
	},
] satisfies CommandModule[];
