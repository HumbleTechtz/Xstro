import type { CommandModule } from "@types";
import { extractUrlFromText } from "baileys";

export default {
	pattern: "instagram",
	aliases: ["ig"],
	fromMe: false,
	isGroup: false,
	desc: "Download Instagram videos",
	type: "download",

	handler: async (msg, args) => {
		const url = extractUrlFromText(args ?? msg?.quoted?.text ?? "");

		if (
			!url ||
			!/^https?:\/\/(?:www\.)?instagram\.com\/[^\/\s]+\/(reel|p|tv)\/[a-zA-Z0-9._%-]+\/?$/i.test(url)
		) {
			return msg.send("Provide a valid Instagram link!");
		}

		const res = await fetch("https://api.cobalt.tools/", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				accept: "application/json",
				"accept-encoding": "identity",          // ← ask for NO compression
				authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkWTA1YzVUQiIsInN1YiI6Ilo0UEZqMjQtIiwiZXhwIjoxNzUyNTYzODg4fQ.uhjxyD9dY-A7yYAnAWpK1twv-gVOuV8FiaFP_bQFchE",
			},
			body: JSON.stringify({ url, localProcessing: "preferred" }),
		})

		console.log(res)

		return msg.send(res?.url ?? "❌ Failed to fetch media.");
	},
} satisfies CommandModule;
