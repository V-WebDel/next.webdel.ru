import { wpFetch } from "./api";
import type { WPHomeAcf, WPPage } from "./types";

export async function getHomeAcf() {
  const pages = await wpFetch<WPPage<WPHomeAcf>[]>(
    "/wp-json/wp/v2/pages?slug=home"
  );

  return pages[0]?.acf;
}

export async function getHomeAcfSafe() {
  try {
    return await getHomeAcf();
  } catch (error) {
    console.warn("Failed to fetch WordPress home ACF data", error);
    return undefined;
  }
}
