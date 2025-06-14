import got, { type Options as gotOps } from "got";
import { Boom } from "@hapi/boom";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";

export const fetch = async function (
	url: string,
	options?: gotOps
): Promise<string> {
	try {
		const data = await got.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.5",
				"Accept-Encoding": "gzip, deflate, br",
				Connection: "keep-alive",
				"Upgrade-Insecure-Requests": "1",
				DNT: "1",
				...options,
			},
			...options,
		});
		return data.body;
	} catch (error) {
		throw new Boom(error as Error);
	}
};

export const postfetch = async function (
	url: string,
	options?: {
		formData?: Record<string, any>;
		jsonBody?: Record<string, any>;
		headers?: Record<string, string>;
	}
): Promise<string> {
	try {
		const defaultHeaders = {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			Accept: "application/json, text/plain, */*",
			"Accept-Language": "en-US,en;q=0.5",
			"Accept-Encoding": "gzip, deflate, br",
			Connection: "keep-alive",
			"Upgrade-Insecure-Requests": "1",
			DNT: "1",
		};

		let body: any;
		let contentHeaders = {};

		if (options?.jsonBody) {
			body = JSON.stringify(options.jsonBody);
			contentHeaders = { "Content-Type": "application/json" };
		} else if (options?.formData) {
			const form = new FormData();
			for (const [key, value] of Object.entries(options.formData)) {
				form.append(key, value);
			}
			body = form;
			contentHeaders = form.getHeaders();
		}

		const response = await got.post(url, {
			headers: {
				...defaultHeaders,
				...contentHeaders,
				...options?.headers,
			},
			body,
			throwHttpErrors: true,
		});

		return response.body;
	} catch (error: any) {
		throw new Boom(error.message, {
			statusCode: error.response?.statusCode || 500,
			data: error.response?.body || null,
		});
	}
};

export const urlBuffer = async function (
	url: string,
	options?: gotOps
): Promise<Buffer> {
	try {
		const data = await got.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.5",
				"Accept-Encoding": "gzip, deflate, br",
				Connection: "keep-alive",
				"Upgrade-Insecure-Requests": "1",
				DNT: "1",
				...options?.headers,
			},
			responseType: "buffer",
			...options,
		});
		return data.rawBody;
	} catch (error) {
		throw new Boom(error as Error);
	}
};

export function isUrl(text: string): boolean {
	const urlRegex = /\bhttps?:\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*\b/gi;
	return urlRegex.test(text);
}

const MAX_FILE_SIZE_MB = 200;

export const upload = async (buffer: Buffer): Promise<string> => {
	const fileSizeMB = buffer.length / (1024 * 1024);
	if (fileSizeMB > MAX_FILE_SIZE_MB) {
		throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB.`);
	}

	const type = await fileTypeFromBuffer(buffer);
	const ext = type ? type.ext : "bin";

	const bodyForm = new FormData();
	bodyForm.append("fileToUpload", buffer, `file.${ext}`);
	bodyForm.append("reqtype", "fileupload");

	const res = await got.post("https://catbox.moe/user/api.php", {
		body: bodyForm,
		headers: bodyForm.getHeaders(),
	});

	const mediaUrl = res.body;
	if (!mediaUrl.startsWith("http")) {
		throw new Error("Invalid response from server.");
	}

	return mediaUrl;
};
