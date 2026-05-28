import type { Metadata } from "next";
import "@/styles/index.scss";
import "swiper/css";
import "swiper/css/navigation";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
