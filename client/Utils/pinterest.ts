import { chromium } from "playwright";

async function Pinterest(url: string) {
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage();
		await page.goto("https://pinterestdownloader.com/");
		await page.fill("#download_input", url);
		await page.click("#download_button");
		await page.waitForSelector("video[src$='.mp4']", { timeout: 10000 });

		const html = await page.content();
		const match = html.match(/<video[^>]+src="([^"]+\.mp4)"/i);
		console.log(match ? match[1] : "");
	} catch {
		console.log("");
	} finally {
		await browser.close();
	}
}

const url = process.argv[2];
if (!url) process.exit(1);
await Pinterest(url);
