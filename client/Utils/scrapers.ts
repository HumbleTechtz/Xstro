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