import type { Metadata } from "next";
import Elements from "@/components/Elements/Elements";
import Header from "@/components/Header/Header";
import Infographic from "@/components/Infographic/Infographic";
import Portfolio from "@/components/Portfolio/Portfolio";

import { wpFetch } from "@/lib/wp/api";
import { getHomeAcfSafe } from "@/lib/wp/home";
import type { WPPortfolio, WPTerm } from "@/lib/wp/types";

export const revalidate = 60;

const TERM_ORDER = ["quiz", "landing", "multi-page", "best"];
const TERM_LABELS: Record<string, string> = {
  quiz: "Квизы",
  landing: "Лендинги",
  "multi-page": "Многостраничные",
  best: "Избранное",
};

async function getPortfolioItems() {
  return wpFetch<WPPortfolio[]>("/wp-json/wp/v2/portfolio?per_page=100");
}

async function getPortfolioTerms() {
  return wpFetch<WPTerm[]>("/wp-json/wp/v2/url_sites?per_page=100");
}

function getLocalPortfolioImageBase(item: WPPortfolio) {
  const imageUrl = item.yoast_head_json?.og_image?.[0]?.url;
  const filename = imageUrl?.split("/").pop();

  return filename?.replace(/\.[a-z0-9]+$/i, "") || item.slug;
}

export const metadata: Metadata = {
  title: "Портфолио 💼 Wordpress-разработчика - WebDel.ru",
  description:
    "Добро пожаловать в портфолио Frontend-разработчика! Здесь вы найдете примеры моих сайтов: лендинги, квизы, многостраничные сайты и проекты на WordPress.",
};

export default async function PortfolioPage() {
  const [portfolioItems, terms, homePage] = await Promise.all([
    getPortfolioItems(),
    getPortfolioTerms(),
    getHomeAcfSafe(),
  ]);
  const infographic = homePage?.infographic;

  const preparedTerms = terms
    .filter((term) => term.count !== 0)
    .sort((a, b) => {
      const aIndex = TERM_ORDER.indexOf(a.slug);
      const bIndex = TERM_ORDER.indexOf(b.slug);

      return (
        (aIndex === -1 ? TERM_ORDER.length : aIndex) -
        (bIndex === -1 ? TERM_ORDER.length : bIndex)
      );
    })
    .map((term) => ({
      id: term.id,
      name: TERM_LABELS[term.slug] || term.name,
      slug: term.slug,
      count: term.count,
    }));

  const items = portfolioItems.map((item) => {
    const imageBase = getLocalPortfolioImageBase(item);

    return {
      id: item.id,
      title: item.title.rendered,
      href: `/portfolio/${item.slug}`,
      date: item.date,
      termIds: item.url_sites ?? [],
      imageJpg: `/images/portfolio/${imageBase}.jpg`,
      imageWebp: `/images/portfolio/${imageBase}.webp`,
      imageAlt: item.title.rendered,
    };
  });

  return (
    <main>
      <div className="inner inner--top inner--full">
        <Header />
        <Portfolio items={items} terms={preparedTerms} />
        <Elements />
      </div>

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
