import type { ReactNode } from "react";
import Footer from "@/components/Footer/Footer";

import { getHomeAcfSafe } from "@/lib/wp/home";

export const dynamic = "force-dynamic";

export default async function PortfolioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const footer = await getHomeAcfSafe();

  return (
    <div className="wrapper">
      {children}
      <Footer
        logotype={footer?.logotype}
        copyright={footer?.copyright_footer?.text}
        messengers={footer?.messengers_footer?.items}
      />
    </div>
  );
}
