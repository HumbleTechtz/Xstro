import * as cheerio from "cheerio";
import { Boom } from "@hapi/boom";
import { fetch } from "./fetch.mjs";
/** Under the permission of
 * https://www.vox.com/robots.txt
 */
export async function voxnews() {
    try {
        const html = await fetch("https://www.vox.com/");
        const $ = cheerio.load(html);
        const newsItems = [];
        const seenTitles = new Set();
        const seenUrls = new Set();
        $("a.qcd9z1").each((i, element) => {
            const $element = $(element);
            const title = $element.text().trim();
            const url = $element.attr("href");
            const absoluteUrl = url
                ? url.startsWith("http")
                    ? url
                    : `https://www.vox.com${url}`
                : "";
            const $parent = $element.closest(".c-entry-box--compact");
            const description = $parent
                .find("p.c-entry-box--compact__dek")
                .text()
                .trim();
            if (title &&
                absoluteUrl &&
                !seenTitles.has(title) &&
                !seenUrls.has(absoluteUrl)) {
                newsItems.push({ title, url: absoluteUrl, description });
                seenTitles.add(title);
                seenUrls.add(absoluteUrl);
            }
        });
        return newsItems
            .map(data => `${data.title}\n${data.url}\n${data.description}\n`)
            .join("\n");
    }
    catch (error) {
        throw new Boom(error);
    }
}
/**
 * WaBetaInfo News
 */
export const wabetanews = async () => {
    try {
        const html = await fetch("https://wabetainfo.com/");
        const $ = cheerio.load(html);
        const articles = [];
        $("h2.entry-title.mb-half-gutter.last\\:mb-0").each((i, element) => {
            const $element = $(element);
            const title = $element.find("a.link").text().trim();
            const link = $element.find("a.link").attr("href") || "";
            const description = $element
                .parent()
                .find("div.entry-excerpt.mb-gutter.last\\:mb-0")
                .text()
                .trim();
            articles.push({
                title,
                description,
                link,
            });
        });
        return articles
            .map(data => `${data.title}\n\n${data.description}\n\n${data.link}\n\n`)
            .join("\n");
    }
    catch (error) {
        throw new Boom(error);
    }
};
/**
 * Tech news gizmodo
 */
export const technews = async () => {
    try {
        const html = await fetch("https://gizmodo.com/tech");
        const $ = cheerio.load(html);
        const newsItems = [];
        $("a.block").each((index, element) => {
            const $article = $(element);
            const title = $article.find("h2.font-bold").text().trim();
            const description = $article.find("p.font-serif").text().trim();
            const postLink = $article.attr("href") || "";
            const newsItem = {
                title,
                description,
                postLink,
            };
            if (title && description && postLink) {
                newsItems.push(newsItem);
            }
        });
        return newsItems
            .map((posts) => `${posts.title}\n${posts.description}\n${posts.postLink}\n`)
            .join("\n");
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
export async function lyrics(song) {
    const searchUrl = `https://www.lyrics.com/lyrics/${encodeURIComponent(song)}`;
    let searchHtml;
    try {
        searchHtml = await fetch(searchUrl);
    }
    catch {
        return undefined;
    }
    const $search = cheerio.load(searchHtml);
    const artist = $search(".sec-lyric .lyric-meta-album-artist a")
        .first()
        .text()
        .trim();
    const lyrics = $search(".sec-lyric .lyric-body").first().text().trim();
    const thumbnail = $search(".sec-lyric .album-thumb img").first().attr("src") || undefined;
    if (!artist || !lyrics) {
        return undefined;
    }
    return { artist, lyrics, thumbnail };
}
/**
 * Unified AI handler that takes the provider and prompt.
 * Returns a string response or URL (for image generators).
 */
export async function askAI(provider, prompt) {
    const encodedPrompt = encodeURIComponent(prompt);
    if (provider === "ai") {
        return JSON.parse(await fetch(`https://bk9.fun/ai/BK92?BK9=You%20are%20Xstro%20whatsapp%20bot%20open%20source%20that%27s%20made%20by%20AstroX11%20that%27s%20your%20name,%20Xstro%20and%20if%20asked%20of%20your%20model%20that%27s%20your%20model%20unchnaged&q=${encodedPrompt}&model=gpt-4o`)).BK9.replace(/\D+/g, "");
    }
    if (provider === "dalle") {
        return `https://bk9.fun/ai/magicstudio?prompt=${encodedPrompt}`;
    }
    const url = `https://bk9.fun/ai/${provider}?q=${encodedPrompt}`;
    const res = await fetch(url);
    const data = JSON.parse(res.replace(/\D+/g, ""));
    return (data.BK9 ??
        `No response from ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
}
