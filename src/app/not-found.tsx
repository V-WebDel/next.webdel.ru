import Layout from "@/components/Layout/Layout";
import NotFound from "@/components/NotFound/NotFound";
import Elements from "@/components/Elements/Elements";
import Infographic from "@/components/Infographic/Infographic";
import { wpFetch } from "@/lib/wp/api";
import type { WPHomeAcf, WPPage } from "@/lib/wp/types";

async function getFooterData() {
  const pages = await wpFetch<WPPage<WPHomeAcf>[]>(
    "/wp-json/wp/v2/pages?slug=home"
  );

  return pages[0]?.acf;
}

export default async function NotFoundPage() {
  const footer = await getFooterData();

  return (
    <Layout
      footer={{
        logotype: footer?.logotype,
        copyright_footer: footer?.copyright_footer,
        messengers_footer: footer?.messengers_footer,
      }}
    >
      <main className="not-found-page">
        <div className="inner inner--top inner--not-found">
          <NotFound />
          <Elements />
        </div>

        {footer?.infographic?.show !== false ? (
          <Infographic
            title={footer?.infographic?.title}
            items={footer?.infographic?.items?.map((item) => ({
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
