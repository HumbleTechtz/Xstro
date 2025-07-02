import _api_dl from "../download";
import { extractUrl } from "../common";
import type { CommandModule } from "../client";

export default [
	{
		pattern: "pinterest",
		aliases: ["pint"],
		fromMe: false,
		isGroup: false,
		desc: "Download Pinterest",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(pinterest\.com\/[^\s]+|pin\.it\/[^\s]+)/i.test(url)
			)
				return msg.send("Provide Pinterest URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "facebook",
		aliases: ["fb"],
		fromMe: false,
		isGroup: false,
		desc: "Download Facebook",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(facebook\.com\/[^\s]+|fb\.com\/[^\s]+|fb\.watch\/[^\s]+|m\.facebook\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Facebook URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "instagram",
		aliases: ["ig", "insta"],
		fromMe: false,
		isGroup: false,
		desc: "Download Instagram",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(instagram\.com\/[^\s]+|instagr\.am\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Instagram URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "reddit",
		aliases: ["rd"],
		fromMe: false,
		isGroup: false,
		desc: "Download Reddit",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(reddit\.com\/[^\s]+|redd\.it\/[^\s]+|old\.reddit\.com\/[^\s]+|new\.reddit\.com\/[^\s]+|m\.reddit\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Reddit URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "snapchat",
		aliases: ["snap"],
		fromMe: false,
		isGroup: false,
		desc: "Download Snapchat",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(snapchat\.com\/[^\s]+|t\.snapchat\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Snapchat URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "tiktok",
		fromMe: false,
		isGroup: false,
		desc: "Download TikTok",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(tiktok\.com\/[^\s]+|vm\.tiktok\.com\/[^\s]+|m\.tiktok\.com\/[^\s]+|vt\.tiktok\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide TikTok URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "twitter",
		aliases: ["x"],
		fromMe: false,
		isGroup: false,
		desc: "Download Twitter",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(twitter\.com\/[^\s]+|x\.com\/[^\s]+|t\.co\/[^\s]+|mobile\.twitter\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Twitter/X URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "bluesky",
		aliases: ["bsky"],
		fromMe: false,
		isGroup: false,
		desc: "Download Bluesky",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(bsky\.app\/[^\s]+|staging\.bsky\.app\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Bluesky URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "bilibili",
		aliases: ["bili"],
		fromMe: false,
		isGroup: false,
		desc: "Download Bilibili",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(bilibili\.com\/[^\s]+|b23\.tv\/[^\s]+|bili2233\.cn\/[^\s]+|m\.bilibili\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Bilibili URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "soundcloud",
		aliases: ["sc"],
		fromMe: false,
		isGroup: false,
		desc: "Download SoundCloud",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(soundcloud\.com\/[^\s]+|on\.soundcloud\.com\/[^\s]+|m\.soundcloud\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide SoundCloud URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "twitch",
		aliases: ["tw"],
		fromMe: false,
		isGroup: false,
		desc: "Download Twitch",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(twitch\.tv\/[^\s]+|clips\.twitch\.tv\/[^\s]+|m\.twitch\.tv\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Twitch URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "vimeo",
		fromMe: false,
		isGroup: false,
		desc: "Download Vimeo",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(vimeo\.com\/[^\s]+|player\.vimeo\.com\/[^\s]+)/i.test(
					url
				)
			)
				return msg.send("Provide Vimeo URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "vk",
		fromMe: false,
		isGroup: false,
		desc: "Download VK",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (
				!url ||
				!/https?:\/\/(www\.)?(vk\.com\/[^\s]+|m\.vk\.com\/[^\s]+)/i.test(url)
			)
				return msg.send("Provide VK URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
	{
		pattern: "loom",
		fromMe: false,
		isGroup: false,
		desc: "Download Loom",
		type: "download",
		run: async (msg, args) => {
			const url = extractUrl((args ?? msg.quoted?.text)?.trim());
			if (!url || !/https?:\/\/(www\.)?(loom\.com\/[^\s]+)/i.test(url))
				return msg.send("Provide Loom URL");
			return await msg.send((await _api_dl(url)).url);
		},
	},
] satisfies CommandModule[];
