export async function getAPNews(): Promise<string> {
	const response = await fetch("https://apnews.com/");
	const html = await response.text();

	const linkPattern =
		/<a class="Link " href="([^"]+)"><span class="PagePromoContentIcons-text">([^<]+)<\/span><\/a>/g;
	const results: string[] = [];
	const seenTitles = new Set<string>();
	let match: RegExpExecArray | null;

	while ((match = linkPattern.exec(html)) !== null && results.length < 10) {
		const title = match[2].trim();
		const url = match[1];

		if (!seenTitles.has(title)) {
			seenTitles.add(title);
			results.push(`${title}\n${url}`);
		}
	}

	return results.join("\n\n");
}

export async function getWABeta(): Promise<string> {
	const response = await fetch("https://wabetainfo.com/");
	const html = await response.text();

	const titlePattern =
		/<div class="entry-excerpt mb-gutter last:mb-0">\s*([^<]+?)\s*<\/div>/g;
	const linkPattern =
		/<a class="kenta-button kenta-button-right entry-read-more" href="([^"]+)"/g;

	const titles: string[] = [];
	const links: string[] = [];
	let titleMatch: RegExpExecArray | null;
	let linkMatch: RegExpExecArray | null;

	while ((titleMatch = titlePattern.exec(html)) !== null && titles.length < 5) {
		titles.push(titleMatch[1].trim());
	}

	while ((linkMatch = linkPattern.exec(html)) !== null && links.length < 5) {
		links.push(linkMatch[1]);
	}

	const results: string[] = [];
	for (let i = 0; i < Math.min(titles.length, links.length); i++) {
		results.push(`${titles[i]}\n${links[i]}`);
	}

	return results.join("\n\n");
}

export async function getTradeNews(): Promise<string> {
	const response = await fetch("https://www.tradingview.com/ideas/");
	const html = await response.text();

	const linkPattern =
		/<a href="([^"]+)" data-name="open-idea-popup" class="title-tkslJwxl line-clamp-tkslJwxl stretched-outline-tkslJwxl">([^<]+)<\/a>/g;
	const results: string[] = [];
	const seenTitles = new Set<string>();
	let match: RegExpExecArray | null;

	while ((match = linkPattern.exec(html)) !== null && results.length < 10) {
		const title = match[2].trim();
		const url = match[1];

		if (!seenTitles.has(title)) {
			seenTitles.add(title);
			results.push(`${title}\n${url}`);
		}
	}

	return results.join("\n\n");
}

export async function chatAi(message: string): Promise<string> {
	const payload = {
		messages: [
			{
				content: message,
				role: "user",
			},
		],
		id: "AMek9g0",
		previewToken: null,
		userId: null,
		codeModelMode: true,
		trendingAgentMode: {},
		isMicMode: false,
		userSystemPrompt: null,
		maxTokens: 1024,
		playgroundTopP: null,
		playgroundTemperature: null,
		isChromeExt: false,
		githubToken: "",
		clickedAnswer2: false,
		clickedAnswer3: false,
		clickedForceWebSearch: false,
		visitFromDelta: false,
		isMemoryEnabled: false,
		mobileClient: false,
		userSelectedModel: null,
		validated: `00f37b34-a166-4efb-bce5-1312d87f2f94`,
		imageGenerationMode: false,
		imageGenMode: "autoMode",
		webSearchModePrompt: false,
		deepSearchMode: false,
		domains: null,
		vscodeClient: false,
		codeInterpreterMode: false,
		customProfile: {
			name: "",
			occupation: "",
			traits: [],
			additionalInfo: "",
			enableNewChats: false,
		},
		webSearchModeOption: {
			autoMode: true,
			webMode: false,
			offlineMode: false,
		},
		session: null,
		isPremium: false,
		subscriptionCache: null,
		beastMode: false,
		reasoningMode: false,
		designerMode: false,
		workspaceId: "",
		asyncMode: false,
		integrations: {},
		isTaskPersistent: false,
		selectedElement: null,
	};

	const response = await fetch("https://www.blackbox.ai/api/chat", {
		method: "POST",
		headers: {
			authority: "www.blackbox.ai",
			accept: "*/*",
			"accept-encoding": "gzip, deflate, br, zstd",
			"accept-language": "en-US,en;q=0.6",
			"content-type": "application/json",
			cookie: `sessionId=b77356b5-cd4e-4583-8562-bd6b59f1739e; render_app_version_affinity=dep-d1d4o86mcj7s73fe587g; __Host-authjs.csrf-token=4f24883e27796e934ce133cc84f5c20a36cf4fd4be8418ba961d08fdf9921aa2%7Cc248084c3224262fb9bba49125252704ebde9b5bfc99ca581fbb52b624f7896e; __Secure-authjs.callback-url=https%3A%2F%2Fwww.blackbox.ai; intercom-id-x55eda6t=9eaf931b-45f3-4a0a-95ed-70a5b715903a; intercom-session-x55eda6t=; intercom-device-id-x55eda6t=7979dfab-3ad7-47fd-9734-1401c8431c8b`,
			dnt: "1",
			origin: "https://www.blackbox.ai",
			priority: "u=1, i",
			referer: `https://www.blackbox.ai/chat/AMek9g0`,
			"sec-ch-ua": '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"sec-gpc": "1",
			"user-agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	return response.text();
}
