import Layout from "@/components/layout/Layout";
import { wpFetch } from "@/lib/wp/api";
import type { WPPage } from "@/lib/wp/types";
import { extractYoastMeta } from "@/lib/wp/yoast";
import Head from "next/head";

type Props = { page: WPPage | null };

export default function Home({ page }: Props) {
  const yoast = extractYoastMeta(page?.yoast_head_json);

  return (
    <>
      <Head>
        {yoast.canonical ? <link rel="canonical" href={yoast.canonical} /> : null}
        {yoast.og?.title ? <meta property="og:title" content={yoast.og.title} /> : null}
        {yoast.og?.description ? <meta property="og:description" content={yoast.og.description} /> : null}
        {yoast.og?.image ? <meta property="og:image" content={yoast.og.image} /> : null}
      </Head>

      <Layout title={yoast.title} description={yoast.description}>
        <h1 dangerouslySetInnerHTML={{ __html: page?.title?.rendered ?? "Home" }} />
        {/* пример доступа к ACF */}
        {/* <pre>{JSON.stringify(page?.acf, null, 2)}</pre> */}
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  // slug=home — пример. Иногда главная — это page по id (настроено в WP Reading Settings)
  const pages = await wpFetch<WPPage[]>(`/wp-json/wp/v2/pages?slug=home&per_page=1&_embed=1`);

  return {
    props: { page: pages?.[0] ?? null },
    revalidate: 60,
  };
}
