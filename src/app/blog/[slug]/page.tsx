import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "@/components/Article/Article";
import Infographic from "@/components/Infographic/Infographic";

import { wpFetch } from "@/lib/wp/api";
import { getHomeAcfSafe } from "@/lib/wp/home";
import type { WPPost, WPTerm } from "@/lib/wp/types";
import { extractYoastMeta } from "@/lib/wp/yoast";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getPosts() {
  return wpFetch<WPPost[]>("/wp-json/wp/v2/posts?per_page=100");
}

async function getPost(slug: string) {
  const posts = await wpFetch<WPPost[]>(`/wp-json/wp/v2/posts?slug=${slug}`);

  return posts[0];
}

async function getCategories() {
  return wpFetch<WPTerm[]>("/wp-json/wp/v2/categories?per_page=100");
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
    post.yoast_head_json?.twitter_misc?.["Примерное время для чтения"] ||
    post.yoast_head_json?.twitter_misc?.["РџСЂРёРјРµСЂРЅРѕРµ РІСЂРµРјСЏ РґР»СЏ С‡С‚РµРЅРёСЏ"];

  if (!readingTime) return undefined;

  return readingTime.includes("чтен") || readingTime.includes("С‡С‚РµРЅ")
    ? readingTime
    : `${readingTime} чтения`;
}

function getViews(post: WPPost) {
  if (!post.acf?.views) return undefined;

  return `${post.acf.views} просмотров`;
}

function getLocalArticleImage(post?: WPPost) {
  const imageUrl = post?.yoast_head_json?.og_image?.[0]?.url;
  const filename = imageUrl?.split("/").pop();

  if (!filename) return "/images/articles/default.png";

  const imageBase = filename.replace(/\.[a-z0-9]+$/i, "");

  return `/images/articles/${imageBase}.png`;
}

function compareByDateDesc(a: WPPost, b: WPPost) {
  const aTime = a.date ? new Date(a.date).getTime() : 0;
  const bTime = b.date ? new Date(b.date).getTime() : 0;

  return bTime - aTime;
}

function getNeighborPosts(currentPost: WPPost, posts: WPPost[]) {
  const sortedPosts = [...posts].sort(compareByDateDesc);
  const currentIndex = sortedPosts.findIndex((post) => post.id === currentPost.id);
  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined;
  const nextPost =
    currentIndex >= 0 && currentIndex < sortedPosts.length - 1
      ? sortedPosts[currentIndex + 1]
      : undefined;

  return {
    previousPost: previousPost
      ? {
          title: previousPost.title.rendered,
          href: `/blog/${previousPost.slug}`,
          image: getLocalArticleImage(previousPost),
          imageAlt: previousPost.title.rendered,
        }
      : undefined,
    nextPost: nextPost
      ? {
          title: nextPost.title.rendered,
          href: `/blog/${nextPost.slug}`,
          image: getLocalArticleImage(nextPost),
          imageAlt: nextPost.title.rendered,
        }
      : undefined,
  };
}

function getPostCategories(post: WPPost, categories: WPTerm[]) {
  const categoryIds = new Set(post.categories || []);

  return categories
    .filter((category) => categoryIds.has(category.id))
    .map((category) => ({
      id: category.id,
      name: category.name,
    }));
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  const yoast = extractYoastMeta(post.yoast_head_json);

  return {
    title: yoast.title ?? post.title.rendered,
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, posts, categories, homePage] = await Promise.all([
    getPost(slug),
    getPosts(),
    getCategories(),
    getHomeAcfSafe(),
  ]);

  if (!post) {
    notFound();
  }

  const infographic = homePage?.infographic;
  const { previousPost, nextPost } = getNeighborPosts(post, posts);

  return (
    <main>
      <Article
        title={post.title.rendered}
        content={post.content?.rendered}
        date={getFormattedDate(post.date)}
        readingTime={getReadingTime(post)}
        views={getViews(post)}
        categories={getPostCategories(post, categories)}
        previousPost={previousPost}
        nextPost={nextPost}
      />

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
