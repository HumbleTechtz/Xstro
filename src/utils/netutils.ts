import { request } from "undici";

const HEADERS = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  dnt: "1",
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
};

export async function getJson<T = any>(url: string): Promise<T> {
  const res = await request(url, {
    method: "GET",
    headers: HEADERS,
  });

  if (res.statusCode < 200 || res.statusCode >= 300) {
    const text = await res.body.text();
    throw new Error(`GET ${url} failed: ${res.statusCode} ${text}`);
  }

  return (await res.body.json()) as T;
}

export async function postJson<T = any>(
  url: string,
  data: Record<string, any>,
): Promise<T> {
  const res = await request(url, {
    method: "POST",
    headers: {
      ...HEADERS,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.statusCode < 200 || res.statusCode >= 300) {
    const text = await res.body.text();
    throw new Error(`POST ${url} failed: ${res.statusCode} ${text}`);
  }

  return (await res.body.json()) as T;
}

export async function getBuffer(url: string): Promise<Buffer> {
  const res = await request(url, {
    method: "GET",
    headers: HEADERS,
  });

  if (res.statusCode < 200 || res.statusCode >= 300) {
    const text = await res.body.text();
    throw new Error(`BUFFER GET ${url} failed: ${res.statusCode} ${text}`);
  }

  const arrBuf = await res.body.arrayBuffer();
  return Buffer.from(arrBuf);
}
