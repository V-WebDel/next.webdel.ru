import type { WPYoastHead } from "./types";

export function extractYoastMeta(yoast?: WPYoastHead) {
  if (!yoast) return {};
  return {
    title: yoast.title as string | undefined,
    description: yoast.description as string | undefined,
    canonical: yoast.canonical as string | undefined,
    og: yoast.og_title
      ? {
          title: yoast.og_title,
          description: yoast.og_description,
          image: yoast.og_image?.[0]?.url,
        }
      : undefined,
  };
}
