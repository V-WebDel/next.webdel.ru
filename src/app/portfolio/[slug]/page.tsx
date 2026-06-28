import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import Infographic from "@/components/Infographic/Infographic";
import Project from "@/components/Project/Project";
import Similar from "@/components/Similar/Similar";

import { wpFetch } from "@/lib/wp/api";
import type { WPHomeAcf, WPImageMedia, WPPage, WPPortfolio, WPTerm } from "@/lib/wp/types";
import { extractYoastMeta } from "@/lib/wp/yoast";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getPortfolioItems() {
  return wpFetch<WPPortfolio[]>("/wp-json/wp/v2/portfolio?per_page=100");
}

async function getPortfolioTerms() {
  return wpFetch<WPTerm[]>("/wp-json/wp/v2/url_sites?per_page=100");
}

async function getPortfolioItem(slug: string) {
  const items = await wpFetch<WPPortfolio[]>(
    `/wp-json/wp/v2/portfolio?slug=${slug}`
  );

  return items[0];
}

async function getMedia(id?: number) {
  if (!id) return undefined;

  return wpFetch<WPImageMedia>(`/wp-json/wp/v2/media/${id}`);
}

async function getHomePage() {
  const pages = await wpFetch<WPPage<WPHomeAcf>[]>(
    "/wp-json/wp/v2/pages?slug=home"
  );

  return pages[0];
}

function getLocalImage(media?: WPImageMedia) {
  const filename = media?.source_url?.split("/").pop();

  if (!filename) return undefined;

  const base = filename.replace(/\.[a-z0-9]+$/i, "");

  return {
    src: `/images/portfolio/${filename}`,
    webp: `/images/portfolio/${base}.webp`,
    alt: media?.alt_text || "Скрин сайта",
  };
}

function getLocalPortfolioImageBase(item: WPPortfolio) {
  const imageUrl = item.yoast_head_json?.og_image?.[0]?.url;
  const filename = imageUrl?.split("/").pop();

  return filename?.replace(/\.[a-z0-9]+$/i, "") || item.slug;
}

function compareByDateDesc(a: WPPortfolio, b: WPPortfolio) {
  const aTime = a.date ? new Date(a.date).getTime() : 0;
  const bTime = b.date ? new Date(b.date).getTime() : 0;

  return bTime - aTime;
}

function getSimilarItems(
  currentItem: WPPortfolio,
  items: WPPortfolio[],
  terms: WPTerm[]
) {
  const bestTermIds = new Set(
    terms.filter((term) => term.slug === "best").map((term) => term.id)
  );
  const currentTermIds = currentItem.url_sites ?? [];
  const categoryTermIds = currentTermIds.filter((id) => !bestTermIds.has(id));
  const relatedTermIds = categoryTermIds.length ? categoryTermIds : currentTermIds;

  return items
    .filter((item) => {
      if (item.id === currentItem.id) return false;

      return item.url_sites?.some((id) => relatedTermIds.includes(id));
    })
    .sort(compareByDateDesc)
    .map((item) => {
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
}

export async function generateStaticParams() {
  const items = await getPortfolioItems();

  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItem(slug);

  if (!item) return {};

  const yoast = extractYoastMeta(item.yoast_head_json);

  return {
    title: yoast.title ?? item.title.rendered,
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

export default async function PortfolioProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [item, portfolioItems, terms] = await Promise.all([
    getPortfolioItem(slug),
    getPortfolioItems(),
    getPortfolioTerms(),
  ]);

  if (!item) {
    notFound();
  }

  const project = item.acf?.project;
  const similarItems = getSimilarItems(item, portfolioItems, terms);
  const [mobileMedia, desktopMedia, homePage] = await Promise.all([
    getMedia(project?.group?.mobile),
    getMedia(project?.group?.desktop),
    getHomePage(),
  ]);
  const infographic = homePage?.acf?.infographic;

  return (
    <main>
      <div className="inner inner--top">
        <Header />
      </div>

      <Project
        title={item.title.rendered}
        description={item.content?.rendered}
        work={project?.work}
        link={project?.link}
        linkText={project?.text_link || project?.link}
        linkDescription={project?.description}
        variant={project?.variant}
        mobileImage={getLocalImage(mobileMedia)}
        desktopImage={getLocalImage(desktopMedia || mobileMedia)}
      />

      <Similar items={similarItems} />

      {infographic?.show !== false ? (
        <Infographic
          title={infographic?.title}
          items={infographic?.items?.map((item) => ({
            icon: item.svg || "check",
            title: item.subtitle,
            text: item.text,
          }))}
        />
      ) : null}
    </main>
  );
}
