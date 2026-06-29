import Layout from "@/components/layout/Layout";
import NotFound from "@/components/NotFound/NotFound";
import Elements from "@/components/Elements/Elements";
import Infographic from "@/components/Infographic/Infographic";
import { getHomeAcfSafe } from "@/lib/wp/home";

export default async function NotFoundPage() {
  const footer = await getHomeAcfSafe();

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
