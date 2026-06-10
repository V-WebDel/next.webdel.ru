import { wpFetch } from "@/lib/wp/api";
import type { WPPage } from "@/lib/wp/types";

export const POLICY_PAGE_IDS = {
  politica: 15,
  personal: 21,
} as const;

export async function getPolicyPage(id: number) {
  return wpFetch<WPPage<unknown>>(`/wp-json/wp/v2/pages/${id}`);
}
