import { WP_BASE_URL } from "./config";

const RETRY_STATUSES = new Set([429, 500, 502, 503, 504, 508]);
const RETRY_DELAY_MS = 500;
const MAX_ATTEMPTS = 3;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getResponsePreview(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 120);
}

export async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${WP_BASE_URL}${path}`;
  let res: Response | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });

    if (!RETRY_STATUSES.has(res.status) || attempt === MAX_ATTEMPTS) {
      break;
    }

    await wait(RETRY_DELAY_MS * attempt);
  }

  if (!res?.ok) {
    throw new Error(`WP fetch error ${res?.status ?? "unknown"}: ${url}`);
  }

  const text = await res.text();
  const contentType = res.headers.get("content-type") || "unknown";

  if (!text) {
    throw new Error(`WP fetch returned empty response: ${url}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    const preview = getResponsePreview(text);

    throw new Error(
      `WP fetch returned invalid JSON (${contentType}) from ${url}: ${preview}`,
      { cause: error }
    );
  }
}

export async function wpFetchSafe<T>(
  path: string,
  fallback: T,
  context: string,
  init?: RequestInit
): Promise<T> {
  try {
    return await wpFetch<T>(path, init);
  } catch (error) {
    console.warn(`Failed to fetch WordPress ${context}`, error);
    return fallback;
  }
}
