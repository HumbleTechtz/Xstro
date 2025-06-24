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
