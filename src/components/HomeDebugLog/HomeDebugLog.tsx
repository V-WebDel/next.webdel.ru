"use client";

import { useEffect } from "react";

export type HomeDebugData = {
  wpBaseUrl: string;
  wpBaseUrlSource: string;
  homePageLoaded: boolean;
  usedHomeFallback: boolean;
  usedPortfolioFallback: boolean;
  usedMediaFallback: boolean;
  counts: {
    advantagesFromWp: number;
    advantagesRendered: number;
    infographicFromWp: number;
    examplesRendered: number;
    portfolioTopFromWp: number;
    mediaLoaded: number;
  };
  errors: {
    homePage?: string;
    portfolio?: string;
    media?: string;
  };
};

type Props = {
  data: HomeDebugData;
};

export default function HomeDebugLog({ data }: Props) {
  useEffect(() => {
    const errors = Object.fromEntries(
      Object.entries(data.errors).filter(([, message]) => Boolean(message))
    );

    console.group("[WebDel] Home WordPress data");
    console.log("WP base URL:", data.wpBaseUrl);
    console.log("WP base URL source:", data.wpBaseUrlSource);
    console.table(data.counts);
    console.log("Home page loaded:", data.homePageLoaded);
    console.log("Using home fallback:", data.usedHomeFallback);
    console.log("Using portfolio fallback:", data.usedPortfolioFallback);
    console.log("Using media fallback:", data.usedMediaFallback);

    if (Object.keys(errors).length) {
      console.warn("WordPress fetch errors:", errors);
    }

    console.groupEnd();
  }, [data]);

  return null;
}
