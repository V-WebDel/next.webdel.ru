import Head from "next/head";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({ children, title, description }: Props) {
  return (
    <>
      <Head>
        <title>{title ?? "WebDel"}</title>
        {description ? <meta name="description" content={description} /> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
