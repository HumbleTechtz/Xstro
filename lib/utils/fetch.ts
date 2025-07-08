interface HttpOptions extends Omit<RequestInit, "method" | "body"> {
	headers?: Record<string, string>;
}

export const getJson = async <T>(
	url: string,
	options: HttpOptions = {}
): Promise<T> => {
	return await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Accept-Encoding": "gzip, deflate, br, zstd",
			"Accept-Language": "en-US,en;q=0.9",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			DNT: "1",
			Pragma: "no-cache",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "cross-site",
			"Sec-GPC": "1",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			"X-Requested-With": "XMLHttpRequest",
			...options.headers,
		},
		...options,
	})
		.then(res => res.json())
		.catch(console.error);
};

export const postJson = async <T = any, D = any>(
	url: string,
	data: D,
	options: HttpOptions = {}
): Promise<T> => {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Accept-Encoding": "gzip, deflate, br, zstd",
			"Accept-Language": "en-US,en;q=0.9",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			"Content-Type": "application/json",
			DNT: "1",
			Pragma: "no-cache",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "cross-site",
			"Sec-GPC": "1",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			"X-Requested-With": "XMLHttpRequest",
			...(typeof window !== "undefined" && window.location.origin
				? { Origin: window.location.origin }
				: {}),
			...(typeof window !== "undefined" && window.location.href
				? { Referer: window.location.href }
				: {}),
			...options.headers,
		},
		body: JSON.stringify(data),
		...options,
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	return response.json();
};

export const getBuffer = async (
	url: string,
	options: HttpOptions = {}
): Promise<Buffer> => {
	const response = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "*/*",
			"Accept-Encoding": "gzip, deflate, br, zstd",
			"Accept-Language": "en-US,en;q=0.9",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			DNT: "1",
			Pragma: "no-cache",
			"Sec-Fetch-Dest": "image",
			"Sec-Fetch-Mode": "no-cors",
			"Sec-Fetch-Site": "cross-site",
			"Sec-GPC": "1",
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			...options.headers,
		},
		...options,
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const arrayBuffer = await response.arrayBuffer();
	return Buffer.from(arrayBuffer);
};
