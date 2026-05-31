import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="wrapper">
      <div className="inner inner--top">
        <Header />
      </div>
      {children}
      <Footer />
    </div>
  );
}
