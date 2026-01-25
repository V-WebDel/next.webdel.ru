import { WP_BASE_URL } from "./config";

export async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${WP_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`WP fetch error ${res.status}: ${url}`);
  }

  return res.json() as Promise<T>;
}
