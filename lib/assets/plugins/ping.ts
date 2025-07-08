import { exec } from "node:child_process";
import { promisify } from "node:util";
import { URL } from "node:url";
import type { CommandModule } from "@types";

const ping = promisify(exec);

export default [
	{
		pattern: "ping",
		fromMe: false,
		desc: "Check response speed",
		type: "system",
		handler: async message => {
			const start = Date.now();
			const msg = await message.send("Pong!");
			const end = Date.now();
			return await message.edit(`\`\`\`${end - start} ms\`\`\``, msg);
		},
	},

	{
		pattern: "speed",
		fromMe: false,
		desc: "Test network speed (ping)",
		type: "system",
		handler: async msg => {
			const url = "https://web.whatsapp.com";
			let hostname: string;

			try {
				hostname = new URL(url).hostname;
			} catch {
				return await msg.send("❌ Invalid URL.");
			}

			const isWin = process.platform === "win32";
			const cmd = isWin ? `ping -n 1 ${hostname}` : `ping -c 1 ${hostname}`;

			try {
				const { stdout } = await ping(cmd);
				const ms = isWin
					? stdout.match(/time[=<]\s?(\d+)\s?ms/i)?.[1]
					: stdout.match(/time=([\d.]+)\s?ms/)?.[1];

				await msg.send(
					ms
						? `📡 Network Speed Test\nHost: ${hostname}\nPing: ${ms} ms`
						: `📡 Network Speed Test\nHost: ${hostname}\nPing blocked or not available`
				);
			} catch {
				await msg.send("❌ Failed to perform network speed test.");
			}
		},
	},
] satisfies CommandModule[];
