import { ReactNode } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import type { WPHomeAcf } from "@/lib/wp/types";

type Props = {
  children: ReactNode;
  footer?: Pick<
    WPHomeAcf,
    "logotype" | "copyright_footer" | "messengers_footer"
  >;
};

export default function Layout({ children, footer }: Props) {
  return (
    <div className="wrapper">
      <Header />
      {children}
      <Footer
        logotype={footer?.logotype}
        copyright={footer?.copyright_footer?.text}
        messengers={footer?.messengers_footer?.items}
      />
    </div>
  );
}
