import type { Metadata } from "next";
import Politic from "@/components/Politic/Politic";

import { extractYoastMeta } from "@/lib/wp/yoast";
import { getPolicyPage, POLICY_PAGE_IDS } from "../getPolicyPage";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPolicyPage(POLICY_PAGE_IDS.personal);
  const yoast = extractYoastMeta(page.yoast_head_json);

  return {
    title: yoast.title ?? page.title.rendered,
    description: yoast.description,
    alternates: yoast.canonical ? { canonical: yoast.canonical } : undefined,
    openGraph: yoast.og
      ? {
          title: yoast.og.title,
          description: yoast.og.description,
          images: yoast.og.image ? [yoast.og.image] : undefined,
        }
      : undefined,
  };
}

export default async function PersonalPage() {
  const page = await getPolicyPage(POLICY_PAGE_IDS.personal);

  return (
    <main>
      <Politic title={page.title.rendered} content={page.content?.rendered} />
    </main>
  );
}
