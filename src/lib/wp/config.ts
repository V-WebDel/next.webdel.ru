const DEFAULT_WP_BASE_URL = "https://webdel.ru";

export const WP_BASE_URL = (
  process.env.NEXT_PUBLIC_WP_BASE_URL || DEFAULT_WP_BASE_URL
).replace(/\/$/, "");
