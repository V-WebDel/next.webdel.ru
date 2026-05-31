import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { wpFetch } from "@/lib/wp/api";
import type { WPHomeAcf, WPPage } from "@/lib/wp/types";

async function getFooterData() {
  const pages = await wpFetch<WPPage<WPHomeAcf>[]>(
    "/wp-json/wp/v2/pages?slug=home"
  );

  return pages[0]?.acf;
}

export default async function ContactsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const footer = await getFooterData();

  return (
    <div className="wrapper">
      <div className="inner inner--top">
        <Header />
      </div>
      {children}
      <Footer
        logotype={footer?.logotype}
        copyright={footer?.copyright_footer?.text}
        messengers={footer?.messengers_footer?.items}
      />
    </div>
  );
}
