import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Elements from "@/components/Elements/Elements";
import Top from "@/components/Top/Top";
import Advantages from "@/components/Advantages/Advantages";
import Examples from "@/components/Examples/Examples";
import Infographic from "@/components/Infographic/Infographic";
import HomeDebugLog from "@/components/HomeDebugLog/HomeDebugLog";

import { wpFetch } from "@/lib/wp/api";
import { WP_BASE_URL, WP_BASE_URL_SOURCE } from "@/lib/wp/config";
import { getErrorDetails } from "@/lib/wp/errors";
import type { WPImageMedia, WPPage, WPPortfolio } from "@/lib/wp/types";
import { extractYoastMeta } from "@/lib/wp/yoast";

export const revalidate = 60;
export const dynamic = "force-dynamic";

async function getHomePage() {
  const pages = await wpFetch<WPPage[]>("/wp-json/wp/v2/pages?slug=home");

  if (!pages[0]) {
    throw new Error("Home page was not found in WordPress");
  }

  return pages[0];
}

async function getHomePageSafe() {
  const result = await getHomePageResult();

  return result.data;
}

async function getHomePageResult() {
  try {
    return { data: await getHomePage() };
  } catch (error) {
    console.warn("Failed to fetch WordPress home page data", error);
    return { data: undefined, error: getErrorDetails(error) };
  }
}

async function getMediaByIdsResult(ids: number[]) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (!uniqueIds.length) return { data: new Map<number, WPImageMedia>() };

  try {
    const media = await wpFetch<WPImageMedia[]>(
      `/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=${uniqueIds.length}`
    );

    return { data: new Map(media.map((item) => [item.id, item])) };
  } catch (error) {
    console.warn("Failed to fetch WordPress media data", error);
    return {
      data: new Map<number, WPImageMedia>(),
      error: getErrorDetails(error),
    };
  }
}

async function getTopPortfolioResult() {
  try {
    const portfolio = await wpFetch<WPPortfolio[]>(
      "/wp-json/wp/v2/portfolio?per_page=100"
    );

    return { data: portfolio.filter((item) => item.acf?.in_top === true) };
  } catch (error) {
    console.warn("Failed to fetch WordPress top portfolio data", error);
    return { data: [], error: getErrorDetails(error) };
  }
}

function getLocalPortfolioImageBase(item: WPPortfolio) {
  const imageUrl = item.yoast_head_json?.og_image?.[0]?.url;
  const filename = imageUrl?.split("/").pop();

  return filename?.replace(/\.[a-z0-9]+$/i, "") || item.slug;
}

function getSpriteIconFromMedia(media?: WPImageMedia) {
  if (!media) return undefined;

  const filename = media.source_url?.split("/").pop();
  const fileBase = filename?.replace(/\.[a-z0-9]+$/i, "");

  return media.slug || fileBase;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePageSafe();
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
  const homeResult = await getHomePageResult();
  const page = homeResult.data;
  const acf = page?.acf;
  const portfolioResult = await getTopPortfolioResult();
  const portfolioItems = portfolioResult.data;
  const advantageItems = acf?.advantages?.items ?? [];
  const mediaResult = await getMediaByIdsResult(
    advantageItems
      .map((item) => item.image)
      .filter((id): id is number => typeof id === "number")
  );
  const mediaById = mediaResult.data;
  const advantages = advantageItems.map((item) => {
    const media = item.image ? mediaById.get(item.image) : undefined;

    return {
      name: item.name,
      text: item.text,
      icon: getSpriteIconFromMedia(media),
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
      <HomeDebugLog
        data={{
          wpBaseUrl: WP_BASE_URL,
          wpBaseUrlSource: WP_BASE_URL_SOURCE,
          homePageLoaded: Boolean(page),
          usedHomeFallback: !page,
          usedPortfolioFallback: Boolean(portfolioResult.error),
          usedMediaFallback: Boolean(mediaResult.error),
          counts: {
            advantagesFromWp: advantageItems.length,
            advantagesRendered: advantages.length,
            infographicFromWp: acf?.infographic?.items?.length ?? 0,
            examplesRendered: examples.length,
            portfolioTopFromWp: portfolioItems.length,
            mediaLoaded: mediaById.size,
          },
          errors: {
            homePage: homeResult.error,
            portfolio: portfolioResult.error,
            media: mediaResult.error,
          },
        }}
      />
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
