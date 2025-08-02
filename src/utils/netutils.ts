import { request, Dispatcher } from "undici";

interface JsonObject {
  [key: string]: any;
}

interface RequestOptions {
  headers?: Record<string, string>;
  agent?: Dispatcher;
}

/**
 * Generates browser-like headers for Linux desktop Chrome
 */
const genericAgent = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  dnt: "1",
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  "sec-fetch-site": "none",
  "sec-fetch-mode": "navigate",
  "sec-fetch-user": "?1",
  "sec-fetch-dest": "document",
  "sec-ch-ua": '"Chromium";v="117", "Not=A?Brand";v="8"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Linux"',
};

/**
 * Sends a POST request with JSON body and returns parsed JSON response.
 */
export async function postJson<T = JsonObject>(
  url: string,
  data: JsonObject,
  options: RequestOptions = {},
): Promise<T> {
  const { headers = {}, agent } = options;

  const finalHeaders = {
    ...genericAgent,
    "content-type": "application/json",
    ...headers,
  };

  const res = await request(url, {
    method: "POST",
    headers: finalHeaders,
    body: JSON.stringify(data),
    dispatcher: agent,
    maxRedirections: 5,
  });

  if (res.statusCode < 200 || res.statusCode >= 300) {
    const text = await res.body.text();
    throw new Error(`HTTP ${res.statusCode}: ${text}`);
  }

  const json = await res.body.json();
  return json as T;
}

/**
 * Sends a GET request and returns parsed JSON response.
 */
export async function getJson<T = JsonObject>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { headers = {}, agent } = options;

  const finalHeaders = {
    ...genericAgent,
    ...headers,
  };

  const res = await request(url, {
    method: "GET",
    headers: finalHeaders,
    dispatcher: agent,
    maxRedirections: 5,
  });

  if (res.statusCode < 200 || res.statusCode >= 300) {
    const text = await res.body.text();
    throw new Error(`HTTP ${res.statusCode}: ${text}`);
  }

  const json = await res.body.json();
  return json as T;
}

export async function getBuffer(
  url: string,
  options: RequestOptions = {},
): Promise<Buffer> {
  const { headers = {}, agent } = options;

  const finalHeaders = {
    ...genericAgent,
    ...headers,
  };

  const res = await request(url, {
    method: "GET",
    headers: finalHeaders,
    dispatcher: agent,
    maxRedirections: 5,
  });

  if (res.statusCode < 200 || res.statusCode >= 300) {
    const text = await res.body.text();
    throw new Error(`HTTP ${res.statusCode}: ${text}`);
  }

  const arrayBuffer = await res.body.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
