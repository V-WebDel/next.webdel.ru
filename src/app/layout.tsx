import type { Metadata } from "next";
import ConsentCookies from "@/components/ConsentCookies/ConsentCookies";
import "@/styles/index.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <ConsentCookies />
      </body>
    </html>
  );
}
