const API_TIMEOUT = 5000;

function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_TIMEOUT,
): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout),
    ),
  ]) as Promise<Response>;
}

export async function isValidWord(word: string): Promise<boolean> {
  word = word.trim().toLowerCase();
  if (!/^[a-z]+$/.test(word)) return false;

  const sources = [
    async () => {
      // Free Dictionary API
      const res = await fetchWithTimeout(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );
      if (!res.ok) throw new Error("Not found in dictionaryapi.dev");
      const data = await res.json();
      return Array.isArray(data) && data.length > 0;
    },
    async () => {
      // Datamuse API - returns similar words, including the word itself if it's real
      const res = await fetchWithTimeout(
        `https://api.datamuse.com/words?sp=${word}&max=1`,
      );
      const data = await res.json();
      //@ts-ignore
      return data.length > 0 && data[0].word === word;
    },
    async () => {
      // OwlBot API (may need API key for frequent use, but works anonymously sometimes)
      const res = await fetchWithTimeout(
        `https://owlbot.info/api/v4/dictionary/${word}`,
        {
          headers: {
            Authorization: "Token your_token_here", // remove if not needed or replace with env
          },
        },
      );
      if (!res.ok) throw new Error("Not found in OwlBot");
      const data = await res.json();
      //@ts-ignore
      return !!data.definitions?.length;
    },
  ];

  for (const check of sources) {
    try {
      const result = await check();
      if (result) return true;
    } catch {
      continue; // Try next API
    }
  }

  return false;
}
