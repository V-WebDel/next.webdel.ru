import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Metadata } from "next";
import Blog from "@/components/Blog/Blog";
import Infographic from "@/components/Infographic/Infographic";

import { wpFetch } from "@/lib/wp/api";
import { WP_BASE_URL } from "@/lib/wp/config";
import type { WPHomeAcf, WPPage, WPPost } from "@/lib/wp/types";

export const revalidate = 60;

const POSTS_PER_PAGE = 8;
const ARTICLE_IMAGES_DIR = join(process.cwd(), "public", "images", "articles");

type PageProps = {
  searchParams?: Promise<{ page?: string }>;
};

async function getPosts(page: number) {
  const path = `/wp-json/wp/v2/posts?per_page=${POSTS_PER_PAGE}&page=${page}`;
  const res = await fetch(`${WP_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`WP fetch error ${res.status}: ${WP_BASE_URL}${path}`);
  }

  return {
    items: (await res.json()) as WPPost[],
    totalPages: Number(res.headers.get("X-WP-TotalPages") || 1),
  };
}

async function getHomePage() {
  const pages = await wpFetch<WPPage<WPHomeAcf>[]>(
    "/wp-json/wp/v2/pages?slug=home"
  );

  return pages[0];
}

function getFormattedDate(date?: string) {
  if (!date) return undefined;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getReadingTime(post: WPPost) {
  const readingTime =
    post.acf?.reading_time ||
    post.yoast_head_json?.twitter_misc?.["Примерное время для чтения"];

  if (!readingTime) return undefined;

  return readingTime.includes("чтен") ? readingTime : `${readingTime} чтения`;
}

function getArticleWebpPath(imageBase: string) {
  const webpPath = `/images/articles/${imageBase}.webp`;

  return existsSync(join(ARTICLE_IMAGES_DIR, `${imageBase}.webp`)) ? webpPath : undefined;
}

function getLocalArticleImage(post: WPPost) {
  const imageUrl = post.yoast_head_json?.og_image?.[0]?.url;
  const filename = imageUrl?.split("/").pop();

  if (!filename) {
    return {
      png: "/images/articles/default.png",
      webp: getArticleWebpPath("default"),
    };
  }

  const imageBase = filename.replace(/\.[a-z0-9]+$/i, "");

  return {
    png: `/images/articles/${imageBase}.png`,
    webp: getArticleWebpPath(imageBase),
  };
}

function getPageHref(page: number) {
  return page === 1 ? "/blog" : `/blog?page=${page}`;
}

function getPagination(currentPage: number, totalPages: number) {
  if (totalPages <= 1) return [];

  const pages = new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]);
  const links = [];
  let previousPage = 0;

  if (currentPage > 1) {
    links.push({
      label: "‹",
      href: getPageHref(currentPage - 1),
      rel: "prev" as const,
    });
  }

  [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
    .forEach((page) => {
      if (previousPage && page - previousPage > 1) {
        links.push({ label: "…", dots: true });
      }

      links.push({
        label: String(page),
        href: getPageHref(page),
        current: page === currentPage,
      });
      previousPage = page;
    });

  if (currentPage < totalPages) {
    links.push({
      label: "›",
      href: getPageHref(currentPage + 1),
      rel: "next" as const,
    });
  }

  return links;
}

export const metadata: Metadata = {
  title: "Блог - WebDel.ru",
  description:
    "Статьи о создании сайтов, WordPress, SEO и работе над веб-проектами.",
};

export default async function BlogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page || 1) || 1);
  const [{ items: posts, totalPages }, homePage] = await Promise.all([
    getPosts(currentPage),
    getHomePage(),
  ]);
  const infographic = homePage?.acf?.infographic;

  const items = posts.map((post) => {
    const image = getLocalArticleImage(post);

    return {
      id: post.id,
      title: post.title.rendered,
      href: `/blog/${post.slug}`,
      image: image.png,
      imageWebp: image.webp,
      imageAlt: post.title.rendered,
      readingTime: getReadingTime(post),
      date: getFormattedDate(post.date),
    };
  });

  return (
    <main>
      <Blog items={items} pagination={getPagination(currentPage, totalPages)} />

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
