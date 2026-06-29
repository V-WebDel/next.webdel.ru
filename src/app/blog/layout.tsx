import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { getHomeAcfSafe } from "@/lib/wp/home";

export const dynamic = "force-dynamic";

export default async function BlogLayout({ children }: { children: ReactNode }) {
  const footer = await getHomeAcfSafe();

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
