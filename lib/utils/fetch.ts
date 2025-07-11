import { request } from "undici";

type Headers = Record<string, string>;

const defaultHeaders: Headers = {
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	Accept: "application/json, text/plain, */*",
	DNT: "1",
	Connection: "keep-alive",
	"Accept-Encoding": "gzip, deflate, br",
	"Accept-Language": "en-US,en;q=0.9",
};

export async function get<T = any>(
	url: string,
	headers: Headers = {}
): Promise<T> {
	const res = await request(url, {
		method: "GET",
		headers: { ...defaultHeaders, ...headers },
	});

	if (res.statusCode >= 400) {
		const errorBody = await res.body.text();
		throw new Error(`HTTP ${res.statusCode}: ${errorBody}`);
	}

	return res.body.json() as Promise<T>;
}

export async function post<T = any>(
	url: string,
	data: any,
	headers: Headers = {}
): Promise<T> {
	const res = await request(url, {
		method: "POST",
		headers: {
			...defaultHeaders,
			"Content-Type": "application/json",
			...headers,
		},
		body: JSON.stringify(data),
	});

	if (res.statusCode >= 400) {
		const errorBody = await res.body.text();
		throw new Error(`HTTP ${res.statusCode}: ${errorBody}`);
	}

	return res.body.json() as Promise<T>;
}

export async function getBuffer(
	url: string,
	headers: Headers = {}
): Promise<Buffer> {
	const res = await request(url, {
		method: "GET",
		headers: { ...defaultHeaders, Accept: "*/*", ...headers },
	});

	if (res.statusCode >= 400) {
		const errorBody = await res.body.text();
		throw new Error(`HTTP ${res.statusCode}: ${errorBody}`);
	}

	const chunks: Uint8Array[] = [];
	for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}
