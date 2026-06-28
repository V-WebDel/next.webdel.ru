import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Elements from "@/components/Elements/Elements";
import Top from "@/components/Top/Top";
import Advantages from "@/components/Advantages/Advantages";
import Examples from "@/components/Examples/Examples";
import Infographic from "@/components/Infographic/Infographic";

import { wpFetch } from "@/lib/wp/api";
import type { WPImageMedia, WPPage, WPPortfolio } from "@/lib/wp/types";
import { extractYoastMeta } from "@/lib/wp/yoast";

export const revalidate = 60;

async function getHomePage() {
  const pages = await wpFetch<WPPage[]>("/wp-json/wp/v2/pages?slug=home");

  if (!pages[0]) {
    throw new Error("Home page was not found in WordPress");
  }

  return pages[0];
}

async function getMediaByIds(ids: number[]) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (!uniqueIds.length) return new Map<number, WPImageMedia>();

  const media = await wpFetch<WPImageMedia[]>(
    `/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=${uniqueIds.length}`
  );

  return new Map(media.map((item) => [item.id, item]));
}

async function getTopPortfolio() {
  const portfolio = await wpFetch<WPPortfolio[]>(
    "/wp-json/wp/v2/portfolio?per_page=100"
  );

  return portfolio.filter((item) => item.acf?.in_top === true);
}

function getLocalPortfolioImageBase(item: WPPortfolio) {
  const imageUrl = item.yoast_head_json?.og_image?.[0]?.url;
  const filename = imageUrl?.split("/").pop();

  return filename?.replace(/\.[a-z0-9]+$/i, "") || item.slug;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  const yoast = extractYoastMeta(page?.yoast_head_json);

  return {
    title: yoast.title ?? "WebDel",
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

export default async function Home() {
  const page = await getHomePage();
  const acf = page.acf;
  const portfolioItems = await getTopPortfolio();
  const advantageItems = acf?.advantages?.items ?? [];
  const mediaById = await getMediaByIds(
    advantageItems
      .map((item) => item.image)
      .filter((id): id is number => typeof id === "number")
  );
  const advantages = advantageItems.map((item) => {
    const media = item.image ? mediaById.get(item.image) : undefined;

    return {
      name: item.name,
      text: item.text,
      imageUrl: media?.source_url,
    };
  });
  const examples = portfolioItems.map((item) => {
    const imageBase = getLocalPortfolioImageBase(item);

    return {
      id: item.id,
      title: item.title.rendered,
      href: `/portfolio/${item.slug}`,
      imageJpg: `/images/portfolio/${imageBase}.jpg`,
      imageWebp: `/images/portfolio/${imageBase}.webp`,
      imageAlt: item.title.rendered,
    };
  });

  return (
    <Layout
      footer={{
        logotype: acf?.logotype,
        copyright_footer: acf?.copyright_footer,
        messengers_footer: acf?.messengers_footer,
      }}
    >
      <main>
        <div className="inner inner--top inner--full">
          <Top
            title={acf?.top?.title}
            hello={acf?.top?.hello}
            text={acf?.top?.text}
            specialty={acf?.top?.specialty}
          />
          <Elements />
        </div>

        {acf?.advantages?.show !== false ? (
          <Advantages title={acf?.advantages?.title} items={advantages} />
        ) : null}

        {acf?.examples?.show !== false ? (
          <Examples
            title={acf?.examples?.title}
            text={acf?.examples?.text}
            buttonText={acf?.examples?.btn}
            buttonHref={acf?.examples?.link || "/portfolio"}
            items={examples}
          />
        ) : null}

        {acf?.infographic?.show !== false ? (
          <Infographic
            title={acf?.infographic?.title}
            items={acf?.infographic?.items?.map((item) => ({
              icon: item.svg || "check",
              title: item.subtitle,
              text: item.text,
            }))}
          />
        ) : null}
      </main>
    </Layout>
  );
}
